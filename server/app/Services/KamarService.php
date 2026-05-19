<?php

namespace App\Services;

use App\Models\Kamar;
use App\Models\RiwayatSewa;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class KamarService
{
    public function getAll(): array
    {
        $kamar = Kamar::orderBy('nomor_kamar')->get();

        return [
            'data' => $kamar,
            'total' => $kamar->count(),
            'tersedia' => $kamar->where('status_kamar', 'tersedia')->count(),
            'terisi' => $kamar->where('status_kamar', 'terisi')->count(),
            'perbaikan' => $kamar->where('status_kamar', 'perbaikan')->count(),
        ];
    }

    public function getById(int $id): Kamar
    {
        return Kamar::findOrFail($id);
    }

    public function create(array $data, ?UploadedFile $foto = null): Kamar
    {
        $kamarData = $this->onlyKamarFields($data);

        if ($foto) {
            $kamarData['foto_kamar'] = $foto->store('kamar', 'public');
        }

        return Kamar::create($kamarData);
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

        $kamar->update($kamarData);

        return $kamar->fresh();
    }

    public function delete(int $id): void
    {
        $kamar = $this->getById($id);

        $hasRentalHistory = RiwayatSewa::where('id_kamar', $id)->exists();

        if ($hasRentalHistory) {
            throw new RuntimeException(
                'Kamar memiliki riwayat sewa, sehingga tidak boleh dihapus. Ubah status kamar menjadi perbaikan jika kamar tidak ingin dipakai sementara.'
            );
        }

        if ($kamar->foto_kamar) {
            Storage::disk('public')->delete($kamar->foto_kamar);
        }

        $kamar->delete();
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
