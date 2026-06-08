<?php

namespace App\Services\Admin;

use App\Models\Pembayaran;
use App\Repositories\Admin\KeuanganRepository;
use Illuminate\Support\Collection;

class LaporanKeuanganService
{
    public function __construct(
        private KeuanganRepository $keuanganRepo
    ) {}

    public function getSummary(?int $bulan = null, ?int $tahun = null): array
    {
        $bulan ??= (int) now()->format('m');
        $tahun ??= (int) now()->format('Y');

        $summary = $this->keuanganRepo->getMonthlySummary($bulan, $tahun);

        $totalPemasukan = $summary['total_pemasukan'];
        $totalPengeluaran = $summary['total_pengeluaran'];
        $tagihanBelumBayar = $summary['tagihan_belum_bayar'];

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

        return $this->keuanganRepo->getPengeluaranList($bulan, $tahun, $limit);
    }

    public function createPengeluaran(array $data): array
    {
        $pengeluaran = $this->keuanganRepo->createPengeluaran($data);

        return [
            'id_pengeluaran' => $pengeluaran->id_pengeluaran,
            'message' => 'Pengeluaran berhasil dicatat.',
        ];
    }

    public function deletePengeluaran(int $idPengeluaran): array
    {
        $pengeluaran = $this->keuanganRepo->findPengeluaran($idPengeluaran);

        abort_unless($pengeluaran, 404, 'Pengeluaran tidak ditemukan.');

        $this->keuanganRepo->deletePengeluaran($pengeluaran);

        return [
            'message' => 'Pengeluaran berhasil dihapus.',
        ];
    }

    public function exportCsv(?int $bulan = null, ?int $tahun = null)
    {
        $bulan ??= (int) now()->format('m');
        $tahun ??= (int) now()->format('Y');

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"laporan-keuangan-{$bulan}-{$tahun}.csv\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
            'X-Accel-Buffering' => 'no',
        ];

        return response()->streamDownload(function () use ($bulan, $tahun) {
            $file = fopen('php://output', 'w');
            fwrite($file, "\xEF\xBB\xBF");
            fputcsv($file, ['Tipe', 'Tanggal', 'Keterangan', 'Jumlah', 'Status/Keterangan']);

            $pembayaranQuery = $this->keuanganRepo->getPembayaranDiterimaQuery($bulan, $tahun);
            foreach ($pembayaranQuery->cursor() as $item) {
                $namaLengkap = $item->tagihan?->riwayatSewa?->user?->nama_lengkap ?? '-';
                $kodeInvoice = $item->tagihan?->kode_invoice ?? '-';

                fputcsv($file, [
                    'Pemasukan',
                    $item->tanggal_bayar,
                    "{$namaLengkap} / {$kodeInvoice}",
                    $item->jumlah_bayar,
                    $item->status_verifikasi
                ]);
            }

            $pengeluaranQuery = $this->keuanganRepo->getPengeluaranQuery($bulan, $tahun);
            foreach ($pengeluaranQuery->cursor() as $item) {
                fputcsv($file, [
                    'Pengeluaran',
                    $item->tanggal_pengeluaran,
                    $item->judul_pengeluaran,
                    $item->jumlah_pengeluaran,
                    $item->deskripsi ?? '-'
                ]);
            }

            $summary = $this->keuanganRepo->getMonthlySummary($bulan, $tahun);

            $totalPemasukan = $summary['total_pemasukan'];
            $totalPengeluaran = $summary['total_pengeluaran'];
            $labaBersih = $totalPemasukan - $totalPengeluaran;

            fputcsv($file, ['', '', '', '', '']);

            fputcsv($file, ['TOTAL PEMASUKAN', '', '', $totalPemasukan, '']);
            fputcsv($file, ['TOTAL PENGELUARAN', '', '', $totalPengeluaran, '']);
            fputcsv($file, ['LABA BERSIH', '', '', $labaBersih, '']);

            fclose($file);
        }, "laporan-keuangan-{$bulan}-{$tahun}.csv", $headers);
    }

    private function getPembayaranTerbaru(int $bulan, int $tahun): Collection
    {
        return $this->formatPembayaranList(
            $this->keuanganRepo->getPembayaranTerbaru($bulan, $tahun, 10)
        );
    }

    private function formatPembayaranList(Collection $pembayaranList): Collection
    {
        return $pembayaranList->map(fn(Pembayaran $pembayaran) => [
            'id_pembayaran' => $pembayaran->id_pembayaran,
            'nama_lengkap' => $pembayaran->tagihan?->riwayatSewa?->user?->nama_lengkap,
            'kode_invoice' => $pembayaran->tagihan?->kode_invoice,
            'tanggal_bayar' => $pembayaran->tanggal_bayar,
            'jumlah_bayar' => $pembayaran->jumlah_bayar,
            'metode_pembayaran' => $pembayaran->metode_pembayaran,
            'status_verifikasi' => $pembayaran->status_verifikasi,
        ]);
    }
}
