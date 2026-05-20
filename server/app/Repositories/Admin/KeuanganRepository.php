<?php

namespace App\Repositories\Admin;

use App\Models\Pembayaran;
use App\Models\Pengeluaran;
use App\Models\Tagihan;
use Illuminate\Support\Collection;

class KeuanganRepository
{
    public function getTotalPemasukan(int $bulan, int $tahun): float
    {
        return (float) Pembayaran::where('status_verifikasi', 'diterima')
            ->whereMonth('tanggal_bayar', $bulan)
            ->whereYear('tanggal_bayar', $tahun)
            ->sum('jumlah_bayar');
    }

    public function getTotalPengeluaran(int $bulan, int $tahun): float
    {
        return (float) Pengeluaran::whereMonth('tanggal_pengeluaran', $bulan)
            ->whereYear('tanggal_pengeluaran', $tahun)
            ->sum('jumlah_pengeluaran');
    }

    public function getTagihanBelumBayar(int $bulan, int $tahun): float
    {
        return (float) Tagihan::whereIn('status_tagihan', ['belum_bayar', 'telat'])
            ->whereMonth('tanggal_tagihan', $bulan)
            ->whereYear('tanggal_tagihan', $tahun)
            ->sum('total_tagihan');
    }

    public function getPengeluaranList(int $bulan, int $tahun, ?int $limit = null): Collection
    {
        $query = Pengeluaran::with('pencatat')
            ->whereMonth('tanggal_pengeluaran', $bulan)
            ->whereYear('tanggal_pengeluaran', $tahun)
            ->orderByDesc('tanggal_pengeluaran');

        if ($limit !== null) {
            $query->limit($limit);
        }

        return $query->get();
    }

    public function createPengeluaran(array $data): Pengeluaran
    {
        return Pengeluaran::create([
            'judul_pengeluaran' => $data['judul_pengeluaran'],
            'deskripsi' => $data['deskripsi'] ?? null,
            'jumlah_pengeluaran' => $data['jumlah_pengeluaran'],
            'tanggal_pengeluaran' => $data['tanggal_pengeluaran'],
            'bukti_foto' => $data['bukti_foto'] ?? null,
            'dibuat_oleh' => $data['dibuat_oleh'],
        ]);
    }

    public function findPengeluaran(int $idPengeluaran): ?Pengeluaran
    {
        return Pengeluaran::find($idPengeluaran);
    }

    public function deletePengeluaran(Pengeluaran $pengeluaran): bool
    {
        return $pengeluaran->delete();
    }

    public function getPembayaranTerbaru(int $bulan, int $tahun, int $limit = 10): Collection
    {
        return Pembayaran::with(['tagihan.riwayatSewa.user'])
            ->whereMonth('tanggal_bayar', $bulan)
            ->whereYear('tanggal_bayar', $tahun)
            ->orderByDesc('tanggal_bayar')
            ->limit($limit)
            ->get();
    }
}
