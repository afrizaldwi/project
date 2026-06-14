<?php

namespace App\Features\Penghuni\Repositories;

use App\Features\Kamar\Models\Kamar;
use App\Features\Sewa\Models\RiwayatSewa;
use App\Models\Tagihan;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
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

        return $query->orderByDesc('tanggal_masuk')->orderByDesc('id_sewa')->get();
    }

    public function paginatePenghuniByStatus(?string $status = 'aktif', ?string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        $query = RiwayatSewa::with(['user', 'kamar'])
            ->whereHas('user', function ($query) {
                $query->where('role', 'penyewa');
            });
        $search = trim((string) $search);

        if ($status && $status !== 'all') {
            $query->where('status_sewa', $status);
        }

        if ($search !== '') {
            $query->where(function ($query) use ($search) {
                $query->whereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('no_hp', 'like', "%{$search}%");
                })->orWhereHas('kamar', function ($kamarQuery) use ($search) {
                    $kamarQuery->where('nomor_kamar', 'like', "%{$search}%");
                });
            });
        }

        return $query->orderByDesc('tanggal_masuk')->orderByDesc('id_sewa')->paginate($perPage);
    }

    public function getKamarTersedia(): Collection
    {
        return Kamar::where('status_kamar', 'tersedia')
            ->whereDoesntHave('riwayatSewa', function ($query) {
                $query->where('status_sewa', 'aktif');
            })
            ->orderBy('nomor_kamar')
            ->get();
    }

    public function findKamarTersediaForUpdate(int $idKamar): ?Kamar
    {
        return Kamar::where('id_kamar', $idKamar)
            ->where('status_kamar', 'tersedia')
            ->whereDoesntHave('riwayatSewa', function ($query) {
                $query->where('status_sewa', 'aktif');
            })
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
