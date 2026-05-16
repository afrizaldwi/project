<?php

namespace App\Services;

use App\Models\Kamar;
use App\Models\RiwayatSewa;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * KamarService — Facade Pattern
 * Menyembunyikan kompleksitas logika bisnis dan akses data kamar.
 * Controller cukup memanggil method di sini tanpa tahu detail implementasinya.
 */
class KamarService
{
    public function getAll(): array
    {
        $kamar = Kamar::orderBy('nomor_kamar')->get();

        return [
            'data'      => $kamar,
            'total'     => $kamar->count(),
            'tersedia'  => $kamar->where('status_kamar', 'tersedia')->count(),
            'terisi'    => $kamar->where('status_kamar', 'terisi')->count(),
        ];
    }

    public function getById(int $id): Kamar
    {
        return Kamar::findOrFail($id);
    }

    public function create(array $data, ?UploadedFile $foto = null): Kamar
    {
        // Factory Method Pattern — pembentukan objek kamar dengan struktur baku
        $kamarData = $this->buildKamarData($data);

        if ($foto) {
            $kamarData['foto_kamar'] = $foto->store('kamar', 'public');
        }

        return Kamar::create($kamarData);
    }

    public function update(int $id, array $data, ?UploadedFile $foto = null): Kamar
    {
        $kamar = $this->getById($id);
        $kamarData = $this->buildKamarData($data);

        if ($foto) {
            // Hapus foto lama jika ada
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

    // Cek apakah kamar masih dihuni (status aktif)
    $masihDihuni = \App\Models\RiwayatSewa::where('id_kamar', $id)
        ->where('status_sewa', 'aktif')
        ->exists();

    if ($masihDihuni) {
        throw new \Exception('Kamar masih dihuni. Selesaikan sewa terlebih dahulu sebelum menghapus.');
    }

    // Hapus semua riwayat sewa kamar ini terlebih dahulu
    \App\Models\RiwayatSewa::where('id_kamar', $id)->delete();

    if ($kamar->foto_kamar) {
        Storage::disk('public')->delete($kamar->foto_kamar);
    }

    $kamar->delete();
    }   

    /**
     * Factory Method Pattern
     * Membentuk struktur data kamar yang konsisten dari raw input.
     */
    private function buildKamarData(array $data): array
    {
        return [
            'nomor_kamar'   => $data['nomor_kamar'],
            'luas_kamar'    => $data['luas_kamar'],
            'fasilitas'     => $data['fasilitas'],
            'harga_bulanan' => $data['harga_bulanan'],
            'status_kamar'  => $data['status_kamar'],
        ];
    }
}