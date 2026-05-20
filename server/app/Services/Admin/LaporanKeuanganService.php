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

        $totalPemasukan = $this->keuanganRepo->getTotalPemasukan($bulan, $tahun);
        $totalPengeluaran = $this->keuanganRepo->getTotalPengeluaran($bulan, $tahun);
        $tagihanBelumBayar = $this->keuanganRepo->getTagihanBelumBayar($bulan, $tahun);

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

    private function getPembayaranTerbaru(int $bulan, int $tahun): Collection
    {
        return $this->keuanganRepo->getPembayaranTerbaru($bulan, $tahun, 10)
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
