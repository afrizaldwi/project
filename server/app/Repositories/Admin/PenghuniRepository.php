<?php

namespace App\Repositories\Admin;

use App\Models\Kamar;
use App\Models\RiwayatSewa;
use App\Models\Tagihan;
use App\Models\User;
use Illuminate\Support\Collection;

class PenghuniRepository
{
    public function getPenghuniByStatus(?string $status = 'aktif'): Collection
    {
        $query = RiwayatSewa::with(['user', 'kamar'])
            ->whereHas('user', function ($query) {
                $query->where('role', 'penyewa');
            });

        if ($status && $status !== 'all') {
            $query->where('status_sewa', $status);
        }

        return $query->orderByDesc('tanggal_masuk')->get();
    }

    public function getKamarTersedia(): Collection
    {
        return Kamar::where('status_kamar', 'tersedia')
            ->orderBy('nomor_kamar')
            ->get();
    }

    public function findKamarTersediaForUpdate(int $idKamar): ?Kamar
    {
        return Kamar::where('id_kamar', $idKamar)
            ->where('status_kamar', 'tersedia')
            ->lockForUpdate()
            ->first();
    }

    public function createUser(array $data): User
    {
        return User::create([
            'nama_lengkap' => $data['nama_lengkap'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => 'penyewa',
            'no_hp' => $data['no_hp'],
            'alamat_asal' => $data['alamat_asal'] ?? null,
        ]);
    }

    public function createSewa(array $data): RiwayatSewa
    {
        return RiwayatSewa::create([
            'id_user' => $data['id_user'],
            'id_kamar' => $data['id_kamar'],
            'tanggal_masuk' => $data['tanggal_masuk'],
            'tanggal_keluar' => $data['tanggal_keluar'],
            'harga_deal' => $data['harga_deal'],
            'durasi_sewa_bulan' => $data['durasi_sewa_bulan'],
            'status_sewa' => 'aktif',
        ]);
    }

    public function createTagihan(array $data): Tagihan
    {
        return Tagihan::create([
            'id_sewa' => $data['id_sewa'],
            'kode_invoice' => $data['kode_invoice'],
            'tanggal_tagihan' => $data['tanggal_tagihan'],
            'tanggal_jatuh_tempo' => $data['tanggal_jatuh_tempo'],
            'total_tagihan' => $data['total_tagihan'],
            'status_tagihan' => $data['status_tagihan'] ?? 'belum_bayar',
        ]);
    }

    public function findActiveSewaForUpdate(int $idSewa): ?RiwayatSewa
    {
        return RiwayatSewa::with(['kamar', 'user'])
            ->where('id_sewa', $idSewa)
            ->where('status_sewa', 'aktif')
            ->lockForUpdate()
            ->first();
    }
}
