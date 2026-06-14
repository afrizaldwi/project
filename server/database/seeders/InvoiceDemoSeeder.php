<?php

namespace Database\Seeders;

use App\Features\Kamar\Models\Kamar;
use App\Features\Tagihan\Models\Pembayaran;
use App\Features\Sewa\Models\RiwayatSewa;
use App\Models\Tagihan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class InvoiceDemoSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@kost.com'],
            [
                'nama_lengkap' => 'Admin Utama',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'no_hp' => '081234567890',
                'alamat_asal' => 'Surabaya',
            ]
        );

        $raka = User::updateOrCreate(
            ['email' => 'raka@kost.com'],
            [
                'nama_lengkap' => 'Raka Pratama',
                'password' => Hash::make('password123'),
                'role' => 'penyewa',
                'no_hp' => '081111111111',
                'alamat_asal' => 'Sidoarjo',
            ]
        );

        $maya = User::updateOrCreate(
            ['email' => 'maya@kost.com'],
            [
                'nama_lengkap' => 'Maya Salsabila',
                'password' => Hash::make('password123'),
                'role' => 'penyewa',
                'no_hp' => '082222222222',
                'alamat_asal' => 'Malang',
            ]
        );

        $roomA = Kamar::updateOrCreate(
            ['nomor_kamar' => 'S-01'],
            [
                'fasilitas' => 'Kasur, Lemari, WiFi',
                'harga_bulanan' => 850000,
                'luas_kamar' => '3x3 m',
                'foto_kamar' => null,
                'status_kamar' => 'terisi',
            ]
        );

        $roomB = Kamar::updateOrCreate(
            ['nomor_kamar' => 'S-02'],
            [
                'fasilitas' => 'Kasur, Lemari, WiFi, AC',
                'harga_bulanan' => 1250000,
                'luas_kamar' => '4x4 m',
                'foto_kamar' => null,
                'status_kamar' => 'terisi',
            ]
        );

        $sewaRaka = RiwayatSewa::updateOrCreate(
            [
                'id_user' => $raka->id,
                'id_kamar' => $roomA->id_kamar,
                'status_sewa' => 'aktif',
            ],
            [
                'tanggal_masuk' => now()->subMonths(3)->toDateString(),
                'tanggal_keluar' => null,
                'harga_deal' => 850000,
                'durasi_sewa_bulan' => 12,
                'status_sewa' => 'aktif',
            ]
        );

        $sewaMaya = RiwayatSewa::updateOrCreate(
            [
                'id_user' => $maya->id,
                'id_kamar' => $roomB->id_kamar,
                'status_sewa' => 'aktif',
            ],
            [
                'tanggal_masuk' => now()->subMonths(2)->toDateString(),
                'tanggal_keluar' => null,
                'harga_deal' => 1250000,
                'durasi_sewa_bulan' => 12,
                'status_sewa' => 'aktif',
            ]
        );

        $paidTagihanRaka = Tagihan::updateOrCreate(
            ['kode_invoice' => 'SALSA-INV-RAKA-001'],
            [
                'id_sewa' => $sewaRaka->id_sewa,
                'tanggal_tagihan' => now()->subMonth()->startOfMonth()->toDateString(),
                'tanggal_jatuh_tempo' => now()->subMonth()->startOfMonth()->addDays(10)->toDateString(),
                'total_tagihan' => 850000,
                'status_tagihan' => 'lunas',
            ]
        );

        Pembayaran::updateOrCreate(
            [
                'id_tagihan' => $paidTagihanRaka->id_tagihan,
                'status_verifikasi' => 'diterima',
            ],
            [
                'tanggal_bayar' => now()->subMonth()->startOfMonth()->addDays(5)->toDateString(),
                'jumlah_bayar' => 850000,
                'metode_pembayaran' => 'transfer bank',
                'bukti_bayar' => null,
                'status_verifikasi' => 'diterima',
                'catatan_admin' => 'Pembayaran diterima untuk demo invoice Salsa.',
            ]
        );

        $paidTagihanMaya = Tagihan::updateOrCreate(
            ['kode_invoice' => 'SALSA-INV-MAYA-001'],
            [
                'id_sewa' => $sewaMaya->id_sewa,
                'tanggal_tagihan' => now()->startOfMonth()->toDateString(),
                'tanggal_jatuh_tempo' => now()->startOfMonth()->addDays(10)->toDateString(),
                'total_tagihan' => 1250000,
                'status_tagihan' => 'lunas',
            ]
        );

        Pembayaran::updateOrCreate(
            [
                'id_tagihan' => $paidTagihanMaya->id_tagihan,
                'status_verifikasi' => 'diterima',
            ],
            [
                'tanggal_bayar' => now()->startOfMonth()->addDays(3)->toDateString(),
                'jumlah_bayar' => 1250000,
                'metode_pembayaran' => 'e-wallet',
                'bukti_bayar' => null,
                'status_verifikasi' => 'diterima',
                'catatan_admin' => 'Pembayaran diterima untuk demo invoice Salsa.',
            ]
        );

        Tagihan::updateOrCreate(
            ['kode_invoice' => 'SALSA-INV-UNPAID-001'],
            [
                'id_sewa' => $sewaRaka->id_sewa,
                'tanggal_tagihan' => now()->toDateString(),
                'tanggal_jatuh_tempo' => now()->addDays(7)->toDateString(),
                'total_tagihan' => 850000,
                'status_tagihan' => 'belum_bayar',
            ]
        );
    }
}
