<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Kamar;
use App\Models\RiwayatSewa;
use App\Models\Tagihan;
use App\Models\Pembayaran;
use App\Features\Keluhan\Models\Keluhan;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use RuntimeException;

class DashboardSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $penyewaUsers = User::where('role', 'penyewa')->get();

        if ($penyewaUsers->isEmpty()) {
            throw new RuntimeException('DashboardSeeder membutuhkan minimal 1 user dengan role penyewa.');
        }

        $kamarList = [];

        for ($i = 1; $i <= 17; $i++) {
            if ($i <= 5) {
                $status = 'tersedia';
            } elseif ($i <= 15) {
                $status = 'terisi';
            } else {
                $status = 'perbaikan';
            }

            $nomorKamar = 'DASH-' . str_pad((string) $i, 2, '0', STR_PAD_LEFT);

            $kamar = Kamar::where('nomor_kamar', $nomorKamar)->first();

            if (!$kamar) {
                $kamar = new Kamar();
                $kamar->nomor_kamar = $nomorKamar;
            }

            $kamar->fasilitas = 'Kasur, Lemari, Meja, Kamar mandi dalam';
            $kamar->harga_bulanan = $i <= 8 ? 750000 : 1000000;
            $kamar->luas_kamar = $i <= 8 ? '3x3 m' : '4x3 m';
            $kamar->foto_kamar = null;
            $kamar->status_kamar = $status;
            $kamar->save();

            $kamarList[] = $kamar;
        }


        $activeSewaList = [];

        $occupiedKamars = collect($kamarList)
            ->where('status_kamar', 'terisi')
            ->values();

        foreach ($occupiedKamars as $index => $kamar) {
            $user = $penyewaUsers[$index % $penyewaUsers->count()];

            $riwayatSewa = RiwayatSewa::where('id_user', $user->id)
                ->where('id_kamar', $kamar->id_kamar)
                ->where('status_sewa', 'aktif')
                ->first();

            if (!$riwayatSewa) {
                $riwayatSewa = new RiwayatSewa();
                $riwayatSewa->id_user = $user->id;
                $riwayatSewa->id_kamar = $kamar->id_kamar;
            }

            $riwayatSewa->tanggal_masuk = $now->copy()->subMonths(2)->startOfMonth()->toDateString();
            $riwayatSewa->tanggal_keluar = null;
            $riwayatSewa->harga_deal = $kamar->harga_bulanan;
            $riwayatSewa->durasi_sewa_bulan = 12;
            $riwayatSewa->status_sewa = 'aktif';
            $riwayatSewa->save();

            $activeSewaList[] = $riwayatSewa;
        }



        $tagihanStatusList = [
            'lunas',
            'lunas',
            'lunas',
            'lunas',
            'lunas',
            'lunas',
            'lunas',
            'lunas',
            'belum_bayar',
            'belum_bayar',
            'belum_bayar',
            'belum_bayar',
            'telat',
            'telat',
        ];

        $tagihanList = [];

        foreach ($tagihanStatusList as $index => $statusTagihan) {
            $riwayatSewa = $activeSewaList[$index % count($activeSewaList)];

            $kodeInvoice = 'DASH-INV-' . $now->format('Ym') . '-' . str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT);

            $tagihan = Tagihan::where('kode_invoice', $kodeInvoice)->first();

            if (!$tagihan) {
                $tagihan = new Tagihan();
                $tagihan->kode_invoice = $kodeInvoice;
                $tagihan->id_sewa = $riwayatSewa->id_sewa;
            }

            $tagihan->tanggal_tagihan = $now->copy()->startOfMonth()->toDateString();
            $tagihan->tanggal_jatuh_tempo = $now->copy()->startOfMonth()->addDays(10)->toDateString();
            $tagihan->total_tagihan = $index < 8 ? 750000 : 1000000;
            $tagihan->status_tagihan = $statusTagihan;
            $tagihan->save();

            $tagihanList[] = $tagihan;
        }

        foreach ($tagihanList as $index => $tagihan) {
            if ($tagihan->status_tagihan !== 'lunas') {
                continue;
            }

            $pembayaran = Pembayaran::where('id_tagihan', $tagihan->id_tagihan)
                ->where('status_verifikasi', 'diterima')
                ->first();

            if (!$pembayaran) {
                $pembayaran = new Pembayaran();
                $pembayaran->id_tagihan = $tagihan->id_tagihan;
            }

            $pembayaran->tanggal_bayar = $now->copy()->day(min($index + 1, 28))->toDateString();
            $pembayaran->jumlah_bayar = $tagihan->total_tagihan;
            $pembayaran->metode_pembayaran = $index % 2 === 0 ? 'transfer bank' : 'cash';
            $pembayaran->bukti_bayar = null;
            $pembayaran->status_verifikasi = 'diterima';
            $pembayaran->catatan_admin = 'Pembayaran diterima untuk data dashboard.';
            $pembayaran->save();
        }

        $keluhanStatusList = [
            'pending',
            'pending',
            'pending',
            'proses',
            'proses',
            'selesai',
            'selesai',
            'selesai',
            'selesai',
            'selesai',
        ];

        foreach ($keluhanStatusList as $index => $statusKeluhan) {
            $riwayatSewa = $activeSewaList[$index % count($activeSewaList)];

            $judulKeluhan = 'Dashboard Keluhan ' . str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT);

            $keluhan = Keluhan::where('judul_keluhan', $judulKeluhan)->first();

            if (!$keluhan) {
                $keluhan = new Keluhan();
                $keluhan->judul_keluhan = $judulKeluhan;
                $keluhan->id_sewa = $riwayatSewa->id_sewa;
            }

            $keluhan->deskripsi_keluhan = 'Data dummy keluhan untuk kebutuhan dashboard.';
            $keluhan->foto_kerusakan = null;
            $keluhan->status_keluhan = $statusKeluhan;
            $keluhan->tanggal_lapor = $now->copy()->subDays($index)->toDateTimeString();
            $keluhan->tanggal_selesai = $statusKeluhan === 'selesai'
                ? $now->copy()->subDays(max($index - 1, 0))->toDateTimeString()
                : null;
            $keluhan->save();
        }
    }
}
