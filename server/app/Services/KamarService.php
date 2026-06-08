<?php

namespace App\Services;

use App\Models\Kamar;
use App\Repositories\Contracts\KamarRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class KamarService
{
    public function __construct(
        private readonly KamarRepositoryInterface $kamarRepository
    ) {}

    public function getAll(): array
    {
        $kamar = $this->kamarRepository->all();

        return [
            'data' => $kamar,
            ...$this->getStats(),
        ];
    }

    public function getPaginated(?string $search = null, ?string $status = null, int $perPage = 10): LengthAwarePaginator
    {
        return $this->kamarRepository->paginate($search, $status, $perPage);
    }


    public function getGroupedRoomTypes()
    {
        $rooms = $this->kamarRepository->getAvailableRooms();

        return $rooms->groupBy(function ($kamar) {
            return substr($kamar->nomor_kamar, 0, 1);
        })->map(function ($group) {
            $kamar = $group->first();
            return [
                'id_kamar' => $kamar->id_kamar,
                'tipe_kamar' => 'Tipe ' . substr($kamar->nomor_kamar, 0, 1),
                'harga_bulanan' => $kamar->harga_bulanan,
                'status_kamar' => $kamar->status_kamar,
                'foto_url' => $kamar->foto_kamar
                    ? url(Storage::url($kamar->foto_kamar))
                    : null,
            ];
        })->values();
    }

    public function getStats(): array
    {
        return [
            'total' => $this->kamarRepository->countByStatus('tersedia')
                + $this->kamarRepository->countByStatus('terisi')
                + $this->kamarRepository->countByStatus('perbaikan'),
            'tersedia' => $this->kamarRepository->countByStatus('tersedia'),
            'terisi' => $this->kamarRepository->countByStatus('terisi'),
            'perbaikan' => $this->kamarRepository->countByStatus('perbaikan'),
        ];
    }

    public function getById(int $id): Kamar
    {
        return $this->kamarRepository->findByIdOrFail($id);
    }

    public function create(array $data, ?UploadedFile $foto = null): Kamar
    {
        $kamarData = $this->onlyKamarFields($data);

        if ($foto) {
            $kamarData['foto_kamar'] = $foto->store('kamar', 'public');
        }

        return $this->kamarRepository->create($kamarData);
    }

    public function update(int $id, array $data, ?UploadedFile $foto = null): Kamar
    {
        $kamar = $this->getById($id);
        $kamarData = $this->onlyKamarFields($data);
        $requestedStatus = $kamarData['status_kamar'] ?? null;
        $hasActiveSewa = $kamar->riwayatSewa()
            ->where('status_sewa', 'aktif')
            ->exists();

        if ($requestedStatus !== null && $hasActiveSewa && $requestedStatus !== 'terisi') {
            throw ValidationException::withMessages([
                'status_kamar' => 'Kamar masih memiliki sewa aktif, status kamar harus tetap terisi.',
            ]);
        }

        if ($requestedStatus === 'terisi' && ! $hasActiveSewa) {
            throw ValidationException::withMessages([
                'status_kamar' => 'Status terisi hanya dapat digunakan untuk kamar dengan sewa aktif.',
            ]);
        }

        if ($foto) {
            if ($kamar->foto_kamar) {
                Storage::disk('public')->delete($kamar->foto_kamar);
            }

            $kamarData['foto_kamar'] = $foto->store('kamar', 'public');
        }

        return $this->kamarRepository->update($id, $kamarData);
    }

    public function delete(int $id): void
    {
        $kamar = $this->getById($id);

        if ($this->kamarRepository->hasRentalHistory($id)) {
            throw new RuntimeException(
                'Kamar tidak dapat dihapus karena sudah memiliki riwayat sewa.'
            );
        }

        if ($kamar->foto_kamar) {
            Storage::disk('public')->delete($kamar->foto_kamar);
        }

        $this->kamarRepository->delete($id);
    }

    private function onlyKamarFields(array $data): array
    {
        return collect($data)
            ->only([
                'nomor_kamar',
                'luas_kamar',
                'fasilitas',
                'harga_bulanan',
                'status_kamar',
            ])
            ->toArray();
    }
}
