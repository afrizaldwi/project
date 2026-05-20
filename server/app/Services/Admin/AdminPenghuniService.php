<?php

namespace App\Services\Admin;

use App\Models\RiwayatSewa;
use App\Repositories\Admin\PenghuniRepository;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AdminPenghuniService
{
    public function __construct(
        private PenghuniRepository $penghuniRepo
    ) {}

    public function getPenghuni(?string $status = 'aktif'): Collection
    {
        return $this->penghuniRepo->getPenghuniByStatus($status)
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
        return $this->penghuniRepo->getKamarTersedia();
    }

    public function createPenghuni(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $kamar = $this->penghuniRepo->findKamarTersediaForUpdate($data['id_kamar']);

            if (! $kamar) {
                throw ValidationException::withMessages([
                    'id_kamar' => 'Kamar tidak ditemukan atau sudah terisi.',
                ]);
            }

            $tanggalMasuk = Carbon::parse($data['tanggal_masuk']);
            $durasiSewa = (int) $data['durasi_sewa_bulan'];
            $tanggalKeluar = $tanggalMasuk->copy()->addMonths($durasiSewa);

            $user = $this->penghuniRepo->createUser($data);

            $sewa = $this->penghuniRepo->createSewa([
                'id_user' => $user->id,
                'id_kamar' => $kamar->id_kamar,
                'tanggal_masuk' => $tanggalMasuk->toDateString(),
                'tanggal_keluar' => $tanggalKeluar->toDateString(),
                'harga_deal' => $kamar->harga_bulanan,
                'durasi_sewa_bulan' => $durasiSewa,
            ]);

            $this->penghuniRepo->createTagihan([
                'id_sewa' => $sewa->id_sewa,
                'kode_invoice' => $this->generateInvoiceCode($user->id),
                'tanggal_tagihan' => $tanggalMasuk->toDateString(),
                'tanggal_jatuh_tempo' => $tanggalMasuk->copy()->addDays(7)->toDateString(),
                'total_tagihan' => $kamar->harga_bulanan,
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
            $sewa = $this->penghuniRepo->findActiveSewaForUpdate($idSewa);

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
