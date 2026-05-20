<?php

namespace App\Services;

use App\Models\Kamar;
use App\Repositories\Contracts\KamarRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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
            'total' => $kamar->count(),
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
                'Kamar memiliki riwayat sewa, sehingga tidak boleh dihapus. Ubah status kamar menjadi perbaikan jika kamar tidak ingin dipakai sementara.'
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
