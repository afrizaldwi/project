<?php

namespace App\Services;

use App\Models\RiwayatSewa;
use App\Models\Tagihan;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class SewaExtensionService
{
    public function getActiveSewaList(): array
    {
        $sewaList = RiwayatSewa::with(['user', 'kamar'])
            ->where('status_sewa', 'aktif')
            ->orderByDesc('tanggal_masuk')
            ->get();

        return $sewaList->map(function (RiwayatSewa $sewa) {
            return $this->formatSewaDetail($sewa);
        })->toArray();
    }

    public function getSewaForExtension(int $id): array
    {
        $sewa = RiwayatSewa::with(['user', 'kamar'])->findOrFail($id);

        return $this->formatSewaDetail($sewa);
    }

    public function perpanjang(int $id, array $data): array
    {
        return DB::transaction(function () use ($id, $data) {
            $sewa = RiwayatSewa::with(['user', 'kamar'])->lockForUpdate()->findOrFail($id);

            if ($sewa->status_sewa !== 'aktif') {
                throw new RuntimeException('Sewa tidak dapat diperpanjang karena statusnya tidak aktif.');
            }

            $tanggalKeluarLama = $this->resolveTanggalKeluar($sewa);

            if (! $tanggalKeluarLama) {
                throw new RuntimeException('Tanggal keluar sewa tidak dapat dihitung.');
            }

            $tanggalMulai = Carbon::parse($data['tanggal_mulai'])->startOfDay();

            if (! $tanggalMulai->equalTo($tanggalKeluarLama)) {
                throw new RuntimeException('Tanggal mulai perpanjangan harus sama dengan tanggal keluar sewa saat ini.');
            }

            $durasiTambahan = (int) $data['durasi_sewa_bulan'];
            $hargaTambahan = (float) $data['harga_deal'];
            $tanggalKeluarBaru = $tanggalKeluarLama->copy()->addMonthsNoOverflow($durasiTambahan);

            $sewa->update([
                'tanggal_keluar' => $tanggalKeluarBaru->toDateString(),
                'durasi_sewa_bulan' => ((int) $sewa->durasi_sewa_bulan) + $durasiTambahan,
                'harga_deal' => ((float) $sewa->harga_deal) + $hargaTambahan,
                'status_sewa' => 'aktif',
            ]);

            $tagihan = Tagihan::create([
                'id_sewa' => $sewa->id_sewa,
                'kode_invoice' => $this->generateInvoiceCode($sewa->id_sewa),
                'tanggal_tagihan' => now()->toDateString(),
                'tanggal_jatuh_tempo' => now()->addDays(7)->toDateString(),
                'total_tagihan' => $hargaTambahan,
                'status_tagihan' => 'belum_bayar',
            ]);

            return [
                'sewa' => $this->formatSewaDetail($sewa->fresh(['user', 'kamar'])),
                'tagihan' => $tagihan,
            ];
        });
    }

    private function formatSewaDetail(RiwayatSewa $sewa): array
    {
        $tanggalKeluar = $this->resolveTanggalKeluar($sewa);

        return [
            'id_sewa' => $sewa->id_sewa,
            'id_user' => $sewa->id_user,
            'id_kamar' => $sewa->id_kamar,
            'nama' => $sewa->user->nama_lengkap ?? '-',
            'email' => $sewa->user->email ?? '-',
            'no_hp' => $sewa->user->no_hp ?? '-',
            'nomor_kamar' => $sewa->kamar->nomor_kamar ?? '-',
            'harga_bulanan' => $sewa->kamar->harga_bulanan ?? 0,
            'harga_deal' => $sewa->harga_deal,
            'tanggal_masuk' => $this->formatDate($sewa->tanggal_masuk),
            'tanggal_keluar' => $tanggalKeluar?->toDateString(),
            'durasi_sewa_bulan' => $sewa->durasi_sewa_bulan,
            'status_sewa' => $sewa->status_sewa,
        ];
    }

    private function resolveTanggalKeluar(RiwayatSewa $sewa): ?Carbon
    {
        if (! empty($sewa->tanggal_keluar)) {
            return Carbon::parse($sewa->tanggal_keluar)->startOfDay();
        }

        if (empty($sewa->tanggal_masuk) || empty($sewa->durasi_sewa_bulan)) {
            return null;
        }

        return Carbon::parse($sewa->tanggal_masuk)
            ->startOfDay()
            ->addMonthsNoOverflow((int) $sewa->durasi_sewa_bulan);
    }

    private function formatDate($value): ?string
    {
        if (empty($value)) {
            return null;
        }

        return Carbon::parse($value)->toDateString();
    }

    private function generateInvoiceCode(int $idSewa): string
    {
        do {
            $code = 'INV-EXT-' . now()->format('Ymd') . '-' . $idSewa . '-' . Str::upper(Str::random(6));
        } while (Tagihan::where('kode_invoice', $code)->exists());

        return $code;
    }
}
