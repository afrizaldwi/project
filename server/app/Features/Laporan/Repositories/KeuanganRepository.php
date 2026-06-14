<?php

namespace App\Features\Laporan\Repositories;

use App\Models\Pembayaran;
use App\Features\Laporan\Models\Pengeluaran;
use App\Models\Tagihan;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class KeuanganRepository
{
    public function getMonthlySummary(int $bulan, int $tahun): array
    {
        $startDate = CarbonImmutable::create($tahun, $bulan, 1)->startOfDay();
        $endDate = $startDate->addMonth();

        $summary = DB::selectOne(
            <<<'SQL'
            WITH pemasukan AS (
                SELECT COALESCE(SUM(jumlah_bayar), 0) AS total
                FROM pembayaran
                WHERE status_verifikasi = 'diterima'
                  AND tanggal_bayar >= ?
                  AND tanggal_bayar < ?
            ),
            pengeluaran AS (
                SELECT COALESCE(SUM(jumlah_pengeluaran), 0) AS total
                FROM pengeluaran
                WHERE tanggal_pengeluaran >= ?
                  AND tanggal_pengeluaran < ?
            ),
            tagihan_belum_bayar AS (
                SELECT COALESCE(SUM(total_tagihan), 0) AS total
                FROM tagihan
                WHERE status_tagihan IN ('belum_bayar', 'telat')
                  AND tanggal_tagihan >= ?
                  AND tanggal_tagihan < ?
            )
            SELECT
                pemasukan.total AS total_pemasukan,
                pengeluaran.total AS total_pengeluaran,
                tagihan_belum_bayar.total AS tagihan_belum_bayar
            FROM pemasukan, pengeluaran, tagihan_belum_bayar
            SQL,
            [
                $startDate,
                $endDate,
                $startDate,
                $endDate,
                $startDate,
                $endDate,
            ]
        );

        return [
            'total_pemasukan' => (float) ($summary->total_pemasukan ?? 0),
            'total_pengeluaran' => (float) ($summary->total_pengeluaran ?? 0),
            'tagihan_belum_bayar' => (float) ($summary->tagihan_belum_bayar ?? 0),
        ];
    }

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

    public function getPengeluaranQuery(int $bulan, int $tahun): Builder
    {
        return Pengeluaran::with('pencatat')
            ->whereMonth('tanggal_pengeluaran', $bulan)
            ->whereYear('tanggal_pengeluaran', $tahun)
            ->orderByDesc('tanggal_pengeluaran')
            ->orderByDesc('id_pengeluaran');
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
        return $this->getPembayaranDiterimaList($bulan, $tahun, $limit);
    }

    public function getPembayaranDiterimaList(int $bulan, int $tahun, ?int $limit = null): Collection
    {
        $query = Pembayaran::with(['tagihan.riwayatSewa.user'])
            ->where('status_verifikasi', 'diterima')
            ->whereMonth('tanggal_bayar', $bulan)
            ->whereYear('tanggal_bayar', $tahun)
            ->orderByDesc('tanggal_bayar')
            ->orderByDesc('created_at');

        if ($limit !== null) {
            $query->limit($limit);
        }

        return $query->get();
    }

    public function getPembayaranDiterimaQuery(int $bulan, int $tahun): Builder
    {
        return Pembayaran::with(['tagihan.riwayatSewa.user'])
            ->where('status_verifikasi', 'diterima')
            ->whereMonth('tanggal_bayar', $bulan)
            ->whereYear('tanggal_bayar', $tahun)
            ->orderByDesc('tanggal_bayar')
            ->orderByDesc('created_at')
            ->orderByDesc('id_pembayaran');
    }
}
