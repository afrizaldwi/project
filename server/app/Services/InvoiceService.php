<?php

namespace App\Services;

use App\Features\Tagihan\Models\Pembayaran;
use Illuminate\Pagination\LengthAwarePaginator;

class InvoiceService
{
    public function getAdminInvoices(int $perPage = 10): LengthAwarePaginator
    {
        $paginator = Pembayaran::with([
            'tagihan.riwayatSewa.user',
            'tagihan.riwayatSewa.kamar',
        ])
            ->where('status_verifikasi', 'diterima')
            ->whereHas('tagihan', function ($query) {
                $query->where('status_tagihan', 'lunas');
            })
            ->orderByDesc('tanggal_bayar')
            ->orderByDesc('id_pembayaran')
            ->paginate($perPage);

        $paginator->setCollection(
            $paginator->getCollection()->map(
                fn(Pembayaran $pembayaran) =>
                $this->formatInvoice($pembayaran)
            )
        );

        return $paginator;
    }

    public function getPenyewaInvoices(
        int $userId,
        int $perPage = 10
    ): LengthAwarePaginator {
        $paginator = Pembayaran::with([
            'tagihan.riwayatSewa.user',
            'tagihan.riwayatSewa.kamar',
        ])
            ->where('status_verifikasi', 'diterima')
            ->whereHas('tagihan', function ($query) use ($userId) {
                $query->where('status_tagihan', 'lunas')
                    ->whereHas('riwayatSewa', function ($sewaQuery) use ($userId) {
                        $sewaQuery->where('id_user', $userId);
                    });
            })
            ->orderByDesc('tanggal_bayar')
            ->orderByDesc('id_pembayaran')
            ->paginate($perPage);

        $paginator->setCollection(
            $paginator->getCollection()->map(
                fn(Pembayaran $pembayaran) =>
                $this->formatInvoice($pembayaran)
            )
        );

        return $paginator;
    }

    public function getInvoiceDetail(int $idPembayaran, ?int $userId = null): array
    {
        $query = Pembayaran::with(['tagihan.riwayatSewa.user', 'tagihan.riwayatSewa.kamar'])
            ->where('id_pembayaran', $idPembayaran)
            ->where('status_verifikasi', 'diterima')
            ->whereHas('tagihan', function ($tagihanQuery) use ($userId) {
                $tagihanQuery->where('status_tagihan', 'lunas');

                if ($userId !== null) {
                    $tagihanQuery->whereHas('riwayatSewa', function ($sewaQuery) use ($userId) {
                        $sewaQuery->where('id_user', $userId);
                    });
                }
            });

        return $this->formatInvoice($query->firstOrFail());
    }

    private function formatInvoice(Pembayaran $pembayaran): array
    {
        $tagihan = $pembayaran->tagihan;
        $sewa = $tagihan?->riwayatSewa;
        $penyewa = $sewa?->user;
        $kamar = $sewa?->kamar;

        return [
            'id_pembayaran' => $pembayaran->id_pembayaran,
            'id_tagihan' => $pembayaran->id_tagihan,
            'kode_invoice' => $tagihan?->kode_invoice,
            'tanggal_tagihan' => $tagihan?->tanggal_tagihan,
            'tanggal_jatuh_tempo' => $tagihan?->tanggal_jatuh_tempo,
            'tanggal_bayar' => $pembayaran->tanggal_bayar,
            'jumlah_bayar' => $pembayaran->jumlah_bayar,
            'total_tagihan' => $tagihan?->total_tagihan,
            'metode_pembayaran' => $pembayaran->metode_pembayaran,
            'status_verifikasi' => $pembayaran->status_verifikasi,
            'catatan_admin' => $pembayaran->catatan_admin,
            'penyewa' => [
                'id' => $penyewa?->id,
                'nama_lengkap' => $penyewa?->nama_lengkap,
                'email' => $penyewa?->email,
                'no_hp' => $penyewa?->no_hp,
                'alamat_asal' => $penyewa?->alamat_asal,
            ],
            'kamar' => [
                'id_kamar' => $kamar?->id_kamar,
                'nomor_kamar' => $kamar?->nomor_kamar,
                'luas_kamar' => $kamar?->luas_kamar,
                'fasilitas' => $kamar?->fasilitas,
                'harga_bulanan' => $kamar?->harga_bulanan,
            ],
            'sewa' => [
                'id_sewa' => $sewa?->id_sewa,
                'tanggal_masuk' => $sewa?->tanggal_masuk,
                'tanggal_keluar' => $sewa?->tanggal_keluar,
                'durasi_sewa_bulan' => $sewa?->durasi_sewa_bulan,
                'harga_deal' => $sewa?->harga_deal,
            ],
        ];
    }
}
