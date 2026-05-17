<?php

namespace Database\Seeders;

use App\Models\Kamar;
use App\Models\Pembayaran;
use App\Models\RiwayatSewa;
use App\Models\Tagihan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class NotificationDemoSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('TRUNCATE TABLE pembayaran, notifikasis, mobile_device_tokens, tagihan, riwayat_sewa, kamar, users RESTART IDENTITY CASCADE');

        $admin = User::create([
            'nama_lengkap' => 'Admin Kost',
            'email' => 'admin@kost.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'no_hp' => '081111111111',
            'alamat_asal' => 'Surabaya',
        ]);

        $budi = User::create([
            'nama_lengkap' => 'Budi Santoso',
            'email' => 'budi@kost.com',
            'password' => Hash::make('password'),
            'role' => 'penyewa',
            'no_hp' => '081234567890',
            'alamat_asal' => 'Sidoarjo',
        ]);

        $rina = User::create([
            'nama_lengkap' => 'Rina Lestari',
            'email' => 'rina@kost.com',
            'password' => Hash::make('password'),
            'role' => 'penyewa',
            'no_hp' => '082345678901',
            'alamat_asal' => 'Malang',
        ]);

        $santi = User::create([
            'nama_lengkap' => 'Santi Wijaya',
            'email' => 'santi@kost.com',
            'password' => Hash::make('password'),
            'role' => 'penyewa',
            'no_hp' => '083456789012',
            'alamat_asal' => 'Gresik',
        ]);

        $invalidPhoneUser = User::create([
            'nama_lengkap' => 'Nomor Tidak Valid',
            'email' => 'nomorinvalid@kost.com',
            'password' => Hash::make('password'),
            'role' => 'penyewa',
            'no_hp' => 'asdasda',
            'alamat_asal' => 'Surabaya',
        ]);

        $roomA = Kamar::create([
            'nomor_kamar' => 'A-01',
            'fasilitas' => 'Kasur, Lemari, WiFi',
            'harga_bulanan' => 750000,
            'luas_kamar' => '3x3 m',
            'foto_kamar' => null,
            'status_kamar' => 'terisi',
        ]);

        $roomB = Kamar::create([
            'nomor_kamar' => 'A-02',
            'fasilitas' => 'Kasur, Lemari, WiFi, Kamar mandi dalam',
            'harga_bulanan' => 1000000,
            'luas_kamar' => '3x4 m',
            'foto_kamar' => null,
            'status_kamar' => 'terisi',
        ]);

        $roomC = Kamar::create([
            'nomor_kamar' => 'A-03',
            'fasilitas' => 'Kasur, Lemari, WiFi',
            'harga_bulanan' => 850000,
            'luas_kamar' => '3x3 m',
            'foto_kamar' => null,
            'status_kamar' => 'terisi',
        ]);

        $roomD = Kamar::create([
            'nomor_kamar' => 'A-04',
            'fasilitas' => 'Kasur, Lemari, WiFi',
            'harga_bulanan' => 900000,
            'luas_kamar' => '3x3 m',
            'foto_kamar' => null,
            'status_kamar' => 'terisi',
        ]);

        $sewaBudi = RiwayatSewa::create([
            'id_user' => $budi->id,
            'id_kamar' => $roomA->id_kamar,
            'tanggal_masuk' => now()->subMonths(2)->toDateString(),
            'tanggal_keluar' => null,
            'harga_deal' => 750000,
            'durasi_sewa_bulan' => 12,
            'status_sewa' => 'aktif',
        ]);

        $sewaRina = RiwayatSewa::create([
            'id_user' => $rina->id,
            'id_kamar' => $roomB->id_kamar,
            'tanggal_masuk' => now()->subMonths(1)->toDateString(),
            'tanggal_keluar' => null,
            'harga_deal' => 1000000,
            'durasi_sewa_bulan' => 12,
            'status_sewa' => 'aktif',
        ]);

        $sewaSanti = RiwayatSewa::create([
            'id_user' => $santi->id,
            'id_kamar' => $roomC->id_kamar,
            'tanggal_masuk' => now()->subMonths(1)->toDateString(),
            'tanggal_keluar' => null,
            'harga_deal' => 850000,
            'durasi_sewa_bulan' => 12,
            'status_sewa' => 'aktif',
        ]);

        $sewaInvalidPhone = RiwayatSewa::create([
            'id_user' => $invalidPhoneUser->id,
            'id_kamar' => $roomD->id_kamar,
            'tanggal_masuk' => now()->subMonths(1)->toDateString(),
            'tanggal_keluar' => null,
            'harga_deal' => 900000,
            'durasi_sewa_bulan' => 12,
            'status_sewa' => 'aktif',
        ]);

        // H-7: should create notification + WhatsApp enabled
        Tagihan::create([
            'id_sewa' => $sewaBudi->id_sewa,
            'kode_invoice' => 'INV-H7-BUDI',
            'tanggal_tagihan' => now()->toDateString(),
            'tanggal_jatuh_tempo' => now()->addDays(7)->toDateString(),
            'total_tagihan' => 750000,
            'status_tagihan' => 'belum_bayar',
        ]);

        // Overdue: should create notification + WhatsApp enabled
        Tagihan::create([
            'id_sewa' => $sewaRina->id_sewa,
            'kode_invoice' => 'INV-OVERDUE-RINA',
            'tanggal_tagihan' => now()->subDays(10)->toDateString(),
            'tanggal_jatuh_tempo' => now()->subDays(2)->toDateString(),
            'total_tagihan' => 1000000,
            'status_tagihan' => 'belum_bayar',
        ]);

        // Paid: should NOT create active warning
        $paidTagihan = Tagihan::create([
            'id_sewa' => $sewaSanti->id_sewa,
            'kode_invoice' => 'INV-PAID-SANTI',
            'tanggal_tagihan' => now()->subDays(5)->toDateString(),
            'tanggal_jatuh_tempo' => now()->addDays(3)->toDateString(),
            'total_tagihan' => 850000,
            'status_tagihan' => 'lunas',
        ]);

        Pembayaran::create([
            'id_tagihan' => $paidTagihan->id_tagihan,
            'tanggal_bayar' => now()->subDays(1)->toDateString(),
            'jumlah_bayar' => 850000,
            'metode_pembayaran' => 'transfer',
            'bukti_bayar' => null,
            'status_verifikasi' => 'diterima',
            'catatan_admin' => 'Pembayaran demo lunas.',
        ]);

        // H-7 but invalid phone: notification active, WhatsApp disabled
        Tagihan::create([
            'id_sewa' => $sewaInvalidPhone->id_sewa,
            'kode_invoice' => 'INV-H7-INVALID-PHONE',
            'tanggal_tagihan' => now()->toDateString(),
            'tanggal_jatuh_tempo' => now()->addDays(7)->toDateString(),
            'total_tagihan' => 900000,
            'status_tagihan' => 'belum_bayar',
        ]);

        // Future > 7 days: should NOT create notification yet
        Tagihan::create([
            'id_sewa' => $sewaBudi->id_sewa,
            'kode_invoice' => 'INV-FUTURE-BUDI',
            'tanggal_tagihan' => now()->toDateString(),
            'tanggal_jatuh_tempo' => now()->addDays(15)->toDateString(),
            'total_tagihan' => 750000,
            'status_tagihan' => 'belum_bayar',
        ]);
    }
}
