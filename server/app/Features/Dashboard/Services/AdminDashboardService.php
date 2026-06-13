<?php

namespace App\Features\Dashboard\Services;

use App\Models\Kamar;
use App\Models\RiwayatSewa;
use App\Models\Tagihan;
use App\Models\Pembayaran;
use App\Models\Keluhan;
use Carbon\Carbon;

class AdminDashboardService
{
    public function getSummary(): array
    {
        $now = Carbon::now();

        return [
            'cards' => [
                'total_kamar' => $this->getTotalKamar(),
                'penghuni_aktif' => $this->getPenghuniAktif(),
                'tagihan_belum_dibayar' => $this->getTagihanBelumDibayar(),
                'pendapatan_bulan_ini' => $this->getPendapatanBulanIni($now),
                'keluhan_pending' => $this->getKeluhanPending(),
            ],

            'charts' => [
                'status_kamar' => $this->getStatusKamar(),
                'status_tagihan' => $this->getStatusTagihan(),
                'status_keluhan' => $this->getStatusKeluhan(),
            ],

            'recent_keluhan' => $this->getRecentKeluhan(),
        ];
    }

    private function getTotalKamar(): int
    {
        return Kamar::count();
    }

    private function getStatusKamar(): array
    {
        return [
            'tersedia' => Kamar::where('status_kamar', 'tersedia')->count(),
            'terisi' => Kamar::where('status_kamar', 'terisi')->count(),
            'perbaikan' => Kamar::where('status_kamar', 'perbaikan')->count(),
        ];
    }

    private function getPenghuniAktif(): int
    {
        return RiwayatSewa::where('status_sewa', 'aktif')->count();
    }

    private function getTagihanBelumDibayar(): int
    {
        return Tagihan::whereIn('status_tagihan', ['belum_bayar', 'telat'])->count();
    }

    private function getPendapatanBulanIni(Carbon $now): int|float
    {
        return Pembayaran::where('status_verifikasi', 'diterima')
            ->whereMonth('tanggal_bayar', $now->month)
            ->whereYear('tanggal_bayar', $now->year)
            ->sum('jumlah_bayar');
    }

    private function getKeluhanPending(): int
    {
        return Keluhan::where('status_keluhan', 'pending')->count();
    }

    private function getStatusTagihan(): array
    {
        return [
            'belum_bayar' => Tagihan::where('status_tagihan', 'belum_bayar')->count(),
            'lunas' => Tagihan::where('status_tagihan', 'lunas')->count(),
            'telat' => Tagihan::where('status_tagihan', 'telat')->count(),
        ];
    }

    private function getStatusKeluhan(): array
    {
        return [
            'pending' => Keluhan::where('status_keluhan', 'pending')->count(),
            'proses' => Keluhan::where('status_keluhan', 'proses')->count(),
            'selesai' => Keluhan::where('status_keluhan', 'selesai')->count(),
        ];
    }

    private function getRecentKeluhan(): array
    {
        return Keluhan::orderBy('tanggal_lapor', 'desc')
            ->limit(5)
            ->get(['judul_keluhan', 'status_keluhan', 'tanggal_lapor'])
            ->map(function ($keluhan) {
                return [
                    'judul' => $keluhan->judul_keluhan,
                    'status' => $keluhan->status_keluhan,
                    'tanggal' => \Carbon\Carbon::parse($keluhan->tanggal_lapor)->format('d M Y'),
                ];
            })
            ->toArray();
    }
}