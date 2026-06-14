<?php

namespace App\Features\Penghuni\Services;

use App\Features\Tagihan\Models\Pembayaran;
use App\Features\Sewa\Models\RiwayatSewa;
use App\Models\Tagihan;
use App\Models\User;
use App\Features\Penghuni\Repositories\PenghuniRepository;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AdminPenghuniService
{
    public function __construct(
        private PenghuniRepository $penghuniRepo
    ) {}

    public function getPenghuni(?string $status = 'aktif'): Collection
    {
        return $this->penghuniRepo->getPenghuniByStatus($status)
            ->map(fn(RiwayatSewa $sewa) => $this->formatPenghuni($sewa));
    }

    public function getPenghuniPaginated(?string $status = 'aktif', ?string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        $paginator = $this->penghuniRepo->paginatePenghuniByStatus($status, $search, $perPage);

        $paginator->getCollection()->transform(
            fn(RiwayatSewa $sewa) => $this->formatPenghuni($sewa)
        );

        return $paginator;
    }

    public function getKamarTersedia(): Collection
    {
        return $this->penghuniRepo->getKamarTersedia();
    }

    public function createPenghuni(array $data, $buktiBayar = null): array
    {
        return DB::transaction(function () use ($data, $buktiBayar) {
            $kamar = $this->penghuniRepo->findKamarTersediaForUpdate($data['id_kamar']);

            if (! $kamar) {
                throw ValidationException::withMessages([
                    'id_kamar' => 'Kamar tidak ditemukan atau sudah terisi.',
                ]);
            }

            $tanggalMasuk = Carbon::parse($data['tanggal_masuk']);
            $durasiSewa = (int) $data['durasi_sewa_bulan'];
            $tanggalKeluar = $tanggalMasuk->copy()->addMonths($durasiSewa);
            $credentials = $this->generatePenyewaCredentials($data['nama_lengkap']);

            $user = $this->penghuniRepo->createUser([
                ...$data,
                'email' => $credentials['email'],
                'password' => $credentials['temporary_password'],
            ]);

            $sewa = $this->penghuniRepo->createSewa([
                'id_user' => $user->id,
                'id_kamar' => $kamar->id_kamar,
                'tanggal_masuk' => $tanggalMasuk->toDateString(),
                'tanggal_keluar' => $tanggalKeluar->toDateString(),
                'harga_deal' => $kamar->harga_bulanan * $durasiSewa,
                'durasi_sewa_bulan' => $durasiSewa,
            ]);

            $tagihan = $this->penghuniRepo->createTagihan([
                'id_sewa' => $sewa->id_sewa,
                'kode_invoice' => $this->generateInvoiceCode($user->id),
                'tanggal_tagihan' => $tanggalMasuk->toDateString(),
                'tanggal_jatuh_tempo' => $tanggalMasuk->toDateString(),
                'total_tagihan' => $kamar->harga_bulanan * $durasiSewa,
                'status_tagihan' => 'lunas',
            ]);

            $buktiBayarPath = null;

            if ($buktiBayar) {
                $buktiBayarPath = $buktiBayar->store('bukti-bayar', 'public');
            }

            Pembayaran::create([
                'id_tagihan' => $tagihan->id_tagihan,
                'tanggal_bayar' => $tanggalMasuk->toDateString(),
                'jumlah_bayar' => $kamar->harga_bulanan * $durasiSewa,
                'metode_pembayaran' => trim((string) ($data['metode_pembayaran'] ?? '')) ?: 'Pembayaran awal admin',
                'bukti_bayar' => $buktiBayarPath,
                'status_verifikasi' => 'diterima',
            ]);

            $kamar->status_kamar = 'terisi';
            $kamar->save();

            return [
                'id_user' => $user->id,
                'id_sewa' => $sewa->id_sewa,
                'credentials' => $credentials,
                'no_hp' => $user->no_hp,
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

            Tagihan::where('id_sewa', $sewa->id_sewa)
                ->whereIn('status_tagihan', ['belum_bayar', 'telat'])
                ->update([
                    'status_tagihan' => 'dibatalkan',
                ]);

            return [
                'message' => 'Penghuni berhasil diarsipkan sebagai alumni.',
            ];
        });
    }

    private function formatPenghuni(RiwayatSewa $sewa): array
    {
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
    }

    private function generatePenyewaCredentials(string $namaLengkap): array
    {
        $baseEmail = Str::slug($namaLengkap, '.');

        if ($baseEmail === '') {
            $baseEmail = 'penyewa';
        }

        do {
            $email = $baseEmail . '.' . random_int(1000, 9999) . '@kost.com';
        } while (User::where('email', $email)->exists());

        return [
            'email' => $email,
            'temporary_password' => 'Kost-' . Str::random(10),
        ];
    }

    private function generateInvoiceCode(int $userId): string
    {
        return 'INV-' . now()->format('YmdHis') . '-' . $userId;
    }
}
