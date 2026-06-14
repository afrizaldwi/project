<?php

namespace App\Features\Dashboard\Services;

use App\Models\Keluhan;
use App\Models\RiwayatSewa;
use App\Models\Tagihan;
use Carbon\Carbon;

class PenyewaDashboardService
{
    public function getSummary(int $userId): array
    {
        $now = Carbon::now();
        $activeSewa = $this->getActiveSewa($userId);

        if (! $activeSewa) {
            return [
                'cards' => [
                    'kamar_saya' => '-',
                    'tagihan_aktif' => 0,
                    'status_pembayaran' => '-',
                    'sisa_masa_sewa' => '-',
                    'keluhan_saya' => 0,
                ],
                'kamar' => null,
                'tagihan_terbaru' => null,
                'kontrak' => null,
                'keluhan_terakhir' => [],
            ];
        }

        $activeTagihan = $this->getActiveTagihan($activeSewa->id_sewa);
        $latestTagihan = $this->getLatestTagihan($activeSewa->id_sewa);
        $displayTagihan = $activeTagihan ?? $latestTagihan;
        $contractMetrics = $this->getContractMetrics($activeSewa, $now);

        return [
            'cards' => [
                'kamar_saya' => $activeSewa->kamar?->nomor_kamar ?? '-',
                'tagihan_aktif' => $this->getTagihanAktif($activeSewa->id_sewa),
                'status_pembayaran' => $displayTagihan?->status_tagihan ?? '-',
                'sisa_masa_sewa' => $contractMetrics['sisa_masa_sewa'],
                'keluhan_saya' => $this->getTotalKeluhanSaya($activeSewa->id_sewa),
            ],
            'kamar' => [
                'nomor_kamar' => $activeSewa->kamar?->nomor_kamar,
                'fasilitas' => $activeSewa->kamar?->fasilitas,
                'harga_bulanan' => $activeSewa->kamar?->harga_bulanan,
                'status_kamar' => $activeSewa->kamar?->status_kamar,
            ],
            'tagihan_terbaru' => $displayTagihan ? [
                'kode_invoice' => $displayTagihan->kode_invoice,
                'tanggal_jatuh_tempo' => $displayTagihan->tanggal_jatuh_tempo,
                'total_tagihan' => $displayTagihan->total_tagihan,
                'status_tagihan' => $displayTagihan->status_tagihan,
            ] : null,
            'kontrak' => [
                'tanggal_masuk' => $activeSewa->tanggal_masuk,
                'tanggal_keluar' => $activeSewa->tanggal_keluar,
                'durasi_sewa_bulan' => $activeSewa->durasi_sewa_bulan,
                'status_sewa' => $activeSewa->status_sewa,
                'progress_persen' => $contractMetrics['progress_persen'],
                'sisa_masa_sewa' => $contractMetrics['sisa_masa_sewa'],
            ],
            'keluhan_terakhir' => $this->getKeluhanTerakhir($activeSewa->id_sewa),
        ];
    }

    private function getActiveSewa(int $userId): ?RiwayatSewa
    {
        return RiwayatSewa::with('kamar')
            ->where('id_user', $userId)
            ->where('status_sewa', 'aktif')
            ->latest('tanggal_masuk')
            ->first();
    }

    private function getActiveTagihan(int $sewaId): ?Tagihan
    {
        return Tagihan::where('id_sewa', $sewaId)
            ->whereIn('status_tagihan', ['belum_bayar', 'telat'])
            ->latest('tanggal_tagihan')
            ->first();
    }

    private function getLatestTagihan(int $sewaId): ?Tagihan
    {
        return Tagihan::where('id_sewa', $sewaId)
            ->latest('tanggal_tagihan')
            ->first();
    }

    private function getTagihanAktif(int $sewaId): int
    {
        return Tagihan::where('id_sewa', $sewaId)
            ->whereIn('status_tagihan', ['belum_bayar', 'telat'])
            ->count();
    }

    private function getTotalKeluhanSaya(int $sewaId): int
    {
        return Keluhan::where('id_sewa', $sewaId)->count();
    }

    private function getContractMetrics(RiwayatSewa $sewa, Carbon $now): array
    {
        if (! $sewa->tanggal_masuk || ! $sewa->durasi_sewa_bulan) {
            return [
                'sisa_masa_sewa' => '-',
                'progress_persen' => 0,
            ];
        }

        $tanggalMulai = Carbon::parse($sewa->tanggal_masuk);
        $tanggalSelesai = $tanggalMulai->copy()->addMonths($sewa->durasi_sewa_bulan);
        $sisaMasaSewa = $now->greaterThanOrEqualTo($tanggalSelesai)
            ? 'Selesai'
            : (int) ceil($now->diffInMonths($tanggalSelesai)) . ' bulan';

        if ($now->greaterThanOrEqualTo($tanggalSelesai)) {
            return [
                'sisa_masa_sewa' => $sisaMasaSewa,
                'progress_persen' => 100,
            ];
        }

        if ($now->lessThanOrEqualTo($tanggalMulai)) {
            return [
                'sisa_masa_sewa' => $sisaMasaSewa,
                'progress_persen' => 0,
            ];
        }

        $totalHari = $tanggalMulai->diffInDays($tanggalSelesai);
        $hariBerjalan = $tanggalMulai->diffInDays($now);

        return [
            'sisa_masa_sewa' => $sisaMasaSewa,
            'progress_persen' => $totalHari <= 0 ? 0 : (int) round(($hariBerjalan / $totalHari) * 100),
        ];
    }

    private function getKeluhanTerakhir(int $sewaId): array
    {
        return Keluhan::where('id_sewa', $sewaId)
            ->latest('tanggal_lapor')
            ->limit(5)
            ->get(['judul_keluhan', 'status_keluhan', 'tanggal_lapor'])
            ->map(function ($keluhan) {
                return [
                    'judul' => $keluhan->judul_keluhan,
                    'status' => $keluhan->status_keluhan,
                    'tanggal' => Carbon::parse($keluhan->tanggal_lapor)->format('d M Y'),
                ];
            })
            ->toArray();
    }
}
