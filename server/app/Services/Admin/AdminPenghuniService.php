<?php

namespace App\Services\Admin;

use App\Models\Kamar;
use App\Models\RiwayatSewa;
use App\Models\Tagihan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AdminPenghuniService
{
    public function getPenghuni(?string $status = 'aktif'): Collection
    {
        $query = RiwayatSewa::with(['user', 'kamar'])
            ->whereHas('user', function ($query) {
                $query->where('role', 'penyewa');
            });

        if ($status && $status !== 'all') {
            $query->where('status_sewa', $status);
        }

        return $query
            ->orderByDesc('tanggal_masuk')
            ->get()
            ->map(function (RiwayatSewa $sewa) {
                return [
                    'id_sewa' => $sewa->id_sewa,
                    'tanggal_masuk' => $sewa->tanggal_masuk,
                    'tanggal_keluar' => $sewa->tanggal_keluar,
                    'harga_deal' => $sewa->harga_deal,
                    'durasi_sewa_bulan' => $sewa->durasi_sewa_bulan,
                    'status_sewa' => $sewa->status_sewa,

                    'user' => [
                        'id' => $sewa->user?->id,
                        'nama_lengkap' => $sewa->user?->nama_lengkap,
                        'email' => $sewa->user?->email,
                        'no_hp' => $sewa->user?->no_hp,
                        'alamat_asal' => $sewa->user?->alamat_asal,
                        'foto_profil' => $sewa->user?->foto_profil,
                    ],

                    'kamar' => [
                        'id_kamar' => $sewa->kamar?->id_kamar,
                        'nomor_kamar' => $sewa->kamar?->nomor_kamar,
                        'fasilitas' => $sewa->kamar?->fasilitas,
                        'harga_bulanan' => $sewa->kamar?->harga_bulanan,
                        'luas_kamar' => $sewa->kamar?->luas_kamar,
                        'foto_kamar' => $sewa->kamar?->foto_kamar,
                        'status_kamar' => $sewa->kamar?->status_kamar,
                    ],
                ];
            });
    }

    public function getKamarTersedia(): Collection
    {
        return Kamar::query()
            ->where('status_kamar', 'tersedia')
            ->whereDoesntHave('riwayatSewa', function ($query) {
                $query->where('status_sewa', 'aktif');
            })
            ->orderBy('nomor_kamar')
            ->get();
    }

    public function createPenghuni(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $kamar = Kamar::where('id_kamar', $data['id_kamar'])
                ->where('status_kamar', 'tersedia')
                ->lockForUpdate()
                ->first();

            if (! $kamar) {
                throw ValidationException::withMessages([
                    'id_kamar' => 'Kamar tidak ditemukan atau sudah terisi.',
                ]);
            }

            $hasActiveSewa = RiwayatSewa::where('id_kamar', $kamar->id_kamar)
                ->where('status_sewa', 'aktif')
                ->exists();

            if ($hasActiveSewa) {
                throw new \Exception('Kamar sudah memiliki penghuni aktif.');
            }

            if ($kamar->status_kamar !== 'tersedia') {
                throw new \Exception('Kamar tidak tersedia.');
            }

            $tanggalMasuk = Carbon::parse($data['tanggal_masuk']);
            $durasiSewa = (int) $data['durasi_sewa_bulan'];
            $tanggalKeluar = $tanggalMasuk->copy()->addMonths($durasiSewa);

            $user = User::create([
                'nama_lengkap' => $data['nama_lengkap'],
                'email' => $data['email'],
                'password' => $data['password'],
                'role' => 'penyewa',
                'no_hp' => $data['no_hp'],
                'alamat_asal' => $data['alamat_asal'] ?? null,
            ]);

            $sewa = RiwayatSewa::create([
                'id_user' => $user->id,
                'id_kamar' => $kamar->id_kamar,
                'tanggal_masuk' => $tanggalMasuk->toDateString(),
                'tanggal_keluar' => $tanggalKeluar->toDateString(),
                'harga_deal' => $kamar->harga_bulanan,
                'durasi_sewa_bulan' => $durasiSewa,
                'status_sewa' => 'aktif',
            ]);

            Tagihan::create([
                'id_sewa' => $sewa->id_sewa,
                'kode_invoice' => $this->generateInvoiceCode($user->id),
                'tanggal_tagihan' => $tanggalMasuk->toDateString(),
                'tanggal_jatuh_tempo' => $tanggalMasuk->copy()->addDays(7)->toDateString(),
                'total_tagihan' => $kamar->harga_bulanan,
                'status_tagihan' => 'belum_bayar',
            ]);

            $kamar->status_kamar = 'terisi';
            $kamar->save();

            return [
                'id_user' => $user->id,
                'id_sewa' => $sewa->id_sewa,
                'message' => 'Penghuni berhasil ditambahkan.',
            ];
        });
    }

    public function finishSewa(int $idSewa, ?string $tanggalKeluar = null): array
    {
        return DB::transaction(function () use ($idSewa, $tanggalKeluar) {
            $sewa = RiwayatSewa::with(['kamar', 'user'])
                ->where('id_sewa', $idSewa)
                ->where('status_sewa', 'aktif')
                ->lockForUpdate()
                ->first();

            if (! $sewa) {
                throw ValidationException::withMessages([
                    'id_sewa' => 'Data sewa tidak ditemukan atau sudah tidak aktif.',
                ]);
            }

            $sewa->status_sewa = 'selesai';
            $sewa->tanggal_keluar = $tanggalKeluar ?? now()->toDateString();
            $sewa->save();

            if ($sewa->kamar) {
                $sewa->kamar->status_kamar = 'tersedia';
                $sewa->kamar->save();
            }

            return [
                'message' => 'Penghuni berhasil diarsipkan sebagai alumni.',
            ];
        });
    }

    private function generateInvoiceCode(int $userId): string
    {
        return 'INV-' . now()->format('YmdHis') . '-' . $userId;
    }
}
