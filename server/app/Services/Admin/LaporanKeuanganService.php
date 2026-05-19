<?php

namespace App\Services\Admin;

use App\Models\Pembayaran;
use App\Models\Pengeluaran;
use App\Models\Tagihan;
use Illuminate\Support\Collection;

class LaporanKeuanganService
{
    public function getSummary(?int $bulan = null, ?int $tahun = null): array
    {
        $bulan ??= (int) now()->format('m');
        $tahun ??= (int) now()->format('Y');

        $totalPemasukan = (float) Pembayaran::where('status_verifikasi', 'diterima')
            ->whereMonth('tanggal_bayar', $bulan)
            ->whereYear('tanggal_bayar', $tahun)
            ->sum('jumlah_bayar');

        $totalPengeluaran = (float) Pengeluaran::whereMonth('tanggal_pengeluaran', $bulan)
            ->whereYear('tanggal_pengeluaran', $tahun)
            ->sum('jumlah_pengeluaran');

        $tagihanBelumBayar = (float) Tagihan::whereIn('status_tagihan', ['belum_bayar', 'telat'])
            ->whereMonth('tanggal_tagihan', $bulan)
            ->whereYear('tanggal_tagihan', $tahun)
            ->sum('total_tagihan');

        return [
            'periode' => [
                'bulan' => $bulan,
                'tahun' => $tahun,
            ],
            'summary' => [
                'total_pemasukan' => $totalPemasukan,
                'total_pengeluaran' => $totalPengeluaran,
                'laba_bersih' => $totalPemasukan - $totalPengeluaran,
                'tagihan_belum_bayar' => $tagihanBelumBayar,
            ],
            'pembayaran_terbaru' => $this->getPembayaranTerbaru($bulan, $tahun),
            'pengeluaran_terbaru' => $this->getPengeluaran($bulan, $tahun, 10),
        ];
    }

    public function getPengeluaran(?int $bulan = null, ?int $tahun = null, ?int $limit = null): Collection
    {
        $bulan ??= (int) now()->format('m');
        $tahun ??= (int) now()->format('Y');

        $query = Pengeluaran::with('pencatat')
            ->whereMonth('tanggal_pengeluaran', $bulan)
            ->whereYear('tanggal_pengeluaran', $tahun)
            ->orderByDesc('tanggal_pengeluaran');

        if ($limit !== null) {
            $query->limit($limit);
        }

        return $query->get();
    }

    public function createPengeluaran(array $data): array
    {
        $pengeluaran = Pengeluaran::create([
            'judul_pengeluaran' => $data['judul_pengeluaran'],
            'deskripsi' => $data['deskripsi'] ?? null,
            'jumlah_pengeluaran' => $data['jumlah_pengeluaran'],
            'tanggal_pengeluaran' => $data['tanggal_pengeluaran'],
            'bukti_foto' => $data['bukti_foto'] ?? null,
            'dibuat_oleh' => $data['dibuat_oleh'],
        ]);

        return [
            'id_pengeluaran' => $pengeluaran->id_pengeluaran,
            'message' => 'Pengeluaran berhasil dicatat.',
        ];
    }

    public function deletePengeluaran(int $idPengeluaran): array
    {
        $pengeluaran = Pengeluaran::find($idPengeluaran);

        abort_unless($pengeluaran, 404, 'Pengeluaran tidak ditemukan.');

        $pengeluaran->delete();

        return [
            'message' => 'Pengeluaran berhasil dihapus.',
        ];
    }

    private function getPembayaranTerbaru(int $bulan, int $tahun): Collection
    {
        return Pembayaran::with(['tagihan.riwayatSewa.user'])
            ->whereMonth('tanggal_bayar', $bulan)
            ->whereYear('tanggal_bayar', $tahun)
            ->orderByDesc('tanggal_bayar')
            ->limit(10)
            ->get()
            ->map(function (Pembayaran $pembayaran) {
                return [
                    'id_pembayaran' => $pembayaran->id_pembayaran,
                    'nama_lengkap' => $pembayaran->tagihan?->riwayatSewa?->user?->nama_lengkap,
                    'kode_invoice' => $pembayaran->tagihan?->kode_invoice,
                    'tanggal_bayar' => $pembayaran->tanggal_bayar,
                    'jumlah_bayar' => $pembayaran->jumlah_bayar,
                    'metode_pembayaran' => $pembayaran->metode_pembayaran,
                    'status_verifikasi' => $pembayaran->status_verifikasi,
                ];
            });
    }
}
