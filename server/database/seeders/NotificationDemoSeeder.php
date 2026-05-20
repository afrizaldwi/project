<?php

namespace Database\Seeders;

use App\Models\Kamar;
use App\Models\Pembayaran;
use App\Models\RiwayatSewa;
use App\Models\Tagihan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class NotificationDemoSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Users
        |--------------------------------------------------------------------------
        */

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

        $budi = User::updateOrCreate(
            ['email' => 'budi@kost.com'],
            [
                'nama_lengkap' => 'Budi Santoso',
                'password' => Hash::make('password123'),
                'role' => 'penyewa',
                'no_hp' => '081234567890',
                'alamat_asal' => 'Sidoarjo',
            ]
        );

        $rina = User::updateOrCreate(
            ['email' => 'rina@kost.com'],
            [
                'nama_lengkap' => 'Rina Lestari',
                'password' => Hash::make('password123'),
                'role' => 'penyewa',
                'no_hp' => '082345678901',
                'alamat_asal' => 'Malang',
            ]
        );

        $santi = User::updateOrCreate(
            ['email' => 'santi@kost.com'],
            [
                'nama_lengkap' => 'Santi Wijaya',
                'password' => Hash::make('password123'),
                'role' => 'penyewa',
                'no_hp' => '083456789012',
                'alamat_asal' => 'Gresik',
            ]
        );

        $dina = User::updateOrCreate(
            ['email' => 'dina@kost.com'],
            [
                'nama_lengkap' => 'Dina Permata',
                'password' => Hash::make('password123'),
                'role' => 'penyewa',
                'no_hp' => '084567890123',
                'alamat_asal' => 'Mojokerto',
            ]
        );

        $invalidPhoneUser = User::updateOrCreate(
            ['email' => 'nomorinvalid@kost.com'],
            [
                'nama_lengkap' => 'Nomor Tidak Valid',
                'password' => Hash::make('password123'),
                'role' => 'penyewa',
                'no_hp' => 'asdasda',
                'alamat_asal' => 'Surabaya',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Kamar
        |--------------------------------------------------------------------------
        */

        $roomA = Kamar::updateOrCreate(
            ['nomor_kamar' => 'A-01'],
            [
                'fasilitas' => 'Kasur, Lemari, WiFi',
                'harga_bulanan' => 750000,
                'luas_kamar' => '3x3 m',
                'foto_kamar' => null,
                'status_kamar' => 'terisi',
            ]
        );

        $roomB = Kamar::updateOrCreate(
            ['nomor_kamar' => 'A-02'],
            [
                'fasilitas' => 'Kasur, Lemari, WiFi, Kamar mandi dalam',
                'harga_bulanan' => 1000000,
                'luas_kamar' => '3x4 m',
                'foto_kamar' => null,
                'status_kamar' => 'terisi',
            ]
        );

        $roomC = Kamar::updateOrCreate(
            ['nomor_kamar' => 'A-03'],
            [
                'fasilitas' => 'Kasur, Lemari, WiFi',
                'harga_bulanan' => 850000,
                'luas_kamar' => '3x3 m',
                'foto_kamar' => null,
                'status_kamar' => 'terisi',
            ]
        );

        $roomD = Kamar::updateOrCreate(
            ['nomor_kamar' => 'A-04'],
            [
                'fasilitas' => 'Kasur, Lemari, WiFi',
                'harga_bulanan' => 900000,
                'luas_kamar' => '3x3 m',
                'foto_kamar' => null,
                'status_kamar' => 'terisi',
            ]
        );

        $roomE = Kamar::updateOrCreate(
            ['nomor_kamar' => 'B-01'],
            [
                'fasilitas' => 'Kasur, Lemari, WiFi, AC',
                'harga_bulanan' => 1250000,
                'luas_kamar' => '4x4 m',
                'foto_kamar' => null,
                'status_kamar' => 'terisi',
            ]
        );

        $roomAvailable = Kamar::updateOrCreate(
            ['nomor_kamar' => 'B-02'],
            [
                'fasilitas' => 'Kasur, Lemari, WiFi, AC',
                'harga_bulanan' => 1250000,
                'luas_kamar' => '4x4 m',
                'foto_kamar' => null,
                'status_kamar' => 'tersedia',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Riwayat Sewa
        |--------------------------------------------------------------------------
        */

        $sewaBudi = RiwayatSewa::updateOrCreate(
            [
                'id_user' => $budi->id,
                'id_kamar' => $roomA->id_kamar,
                'status_sewa' => 'aktif',
            ],
            [
                'tanggal_masuk' => now()->subMonths(2)->toDateString(),
                'tanggal_keluar' => null,
                'harga_deal' => 750000,
                'durasi_sewa_bulan' => 12,
                'status_sewa' => 'aktif',
            ]
        );

        $sewaRina = RiwayatSewa::updateOrCreate(
            [
                'id_user' => $rina->id,
                'id_kamar' => $roomB->id_kamar,
                'status_sewa' => 'aktif',
            ],
            [
                'tanggal_masuk' => now()->subMonths(1)->toDateString(),
                'tanggal_keluar' => null,
                'harga_deal' => 1000000,
                'durasi_sewa_bulan' => 12,
                'status_sewa' => 'aktif',
            ]
        );

        $sewaSanti = RiwayatSewa::updateOrCreate(
            [
                'id_user' => $santi->id,
                'id_kamar' => $roomC->id_kamar,
                'status_sewa' => 'aktif',
            ],
            [
                'tanggal_masuk' => now()->subMonths(1)->toDateString(),
                'tanggal_keluar' => null,
                'harga_deal' => 850000,
                'durasi_sewa_bulan' => 12,
                'status_sewa' => 'aktif',
            ]
        );

        $sewaDina = RiwayatSewa::updateOrCreate(
            [
                'id_user' => $dina->id,
                'id_kamar' => $roomE->id_kamar,
                'status_sewa' => 'aktif',
            ],
            [
                'tanggal_masuk' => now()->subMonths(1)->toDateString(),
                'tanggal_keluar' => null,
                'harga_deal' => 1250000,
                'durasi_sewa_bulan' => 12,
                'status_sewa' => 'aktif',
            ]
        );

        $sewaInvalidPhone = RiwayatSewa::updateOrCreate(
            [
                'id_user' => $invalidPhoneUser->id,
                'id_kamar' => $roomD->id_kamar,
                'status_sewa' => 'aktif',
            ],
            [
                'tanggal_masuk' => now()->subMonths(1)->toDateString(),
                'tanggal_keluar' => null,
                'harga_deal' => 900000,
                'durasi_sewa_bulan' => 12,
                'status_sewa' => 'aktif',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Tagihan Cases
        |--------------------------------------------------------------------------
        | Tagihan status must stay inside: belum_bayar, lunas, telat.
        | Pending belongs to pembayaran.status_verifikasi, not tagihan.
        |--------------------------------------------------------------------------
        */

        // Case 1: H-7 unpaid, should be valid for notification / WhatsApp reminder.
        Tagihan::updateOrCreate(
            ['kode_invoice' => 'INV-H7-BUDI'],
            [
                'id_sewa' => $sewaBudi->id_sewa,
                'tanggal_tagihan' => now()->toDateString(),
                'tanggal_jatuh_tempo' => now()->addDays(7)->toDateString(),
                'total_tagihan' => 750000,
                'status_tagihan' => 'belum_bayar',
            ]
        );

        // Case 2: Overdue, should be valid for telat / reminder testing.
        Tagihan::updateOrCreate(
            ['kode_invoice' => 'INV-OVERDUE-RINA'],
            [
                'id_sewa' => $sewaRina->id_sewa,
                'tanggal_tagihan' => now()->subDays(10)->toDateString(),
                'tanggal_jatuh_tempo' => now()->subDays(2)->toDateString(),
                'total_tagihan' => 1000000,
                'status_tagihan' => 'telat',
            ]
        );

        // Case 3: Paid tagihan, should appear in payment history.
        $paidTagihan = Tagihan::updateOrCreate(
            ['kode_invoice' => 'INV-PAID-SANTI'],
            [
                'id_sewa' => $sewaSanti->id_sewa,
                'tanggal_tagihan' => now()->subDays(20)->toDateString(),
                'tanggal_jatuh_tempo' => now()->subDays(10)->toDateString(),
                'total_tagihan' => 850000,
                'status_tagihan' => 'lunas',
            ]
        );

        Pembayaran::updateOrCreate(
            [
                'id_tagihan' => $paidTagihan->id_tagihan,
                'status_verifikasi' => 'diterima',
            ],
            [
                'tanggal_bayar' => now()->subDays(9)->toDateString(),
                'jumlah_bayar' => 850000,
                'metode_pembayaran' => 'transfer bank',
                'bukti_bayar' => null,
                'status_verifikasi' => 'diterima',
                'catatan_admin' => 'Pembayaran demo sudah diterima.',
            ]
        );

        // Case 4: Pending payment, should appear in admin verification list.
        $pendingTagihan = Tagihan::updateOrCreate(
            ['kode_invoice' => 'INV-PENDING-DINA'],
            [
                'id_sewa' => $sewaDina->id_sewa,
                'tanggal_tagihan' => now()->subDays(3)->toDateString(),
                'tanggal_jatuh_tempo' => now()->addDays(4)->toDateString(),
                'total_tagihan' => 1250000,
                'status_tagihan' => 'belum_bayar',
            ]
        );

        Pembayaran::updateOrCreate(
            [
                'id_tagihan' => $pendingTagihan->id_tagihan,
                'status_verifikasi' => 'pending',
            ],
            [
                'tanggal_bayar' => now()->toDateString(),
                'jumlah_bayar' => 1250000,
                'metode_pembayaran' => 'transfer bank',
                'bukti_bayar' => null,
                'status_verifikasi' => 'pending',
                'catatan_admin' => null,
            ]
        );

        // Case 5: H-7 but phone number invalid, notification can exist but WA should be disabled/invalid.
        Tagihan::updateOrCreate(
            ['kode_invoice' => 'INV-H7-INVALID-PHONE'],
            [
                'id_sewa' => $sewaInvalidPhone->id_sewa,
                'tanggal_tagihan' => now()->toDateString(),
                'tanggal_jatuh_tempo' => now()->addDays(7)->toDateString(),
                'total_tagihan' => 900000,
                'status_tagihan' => 'belum_bayar',
            ]
        );

        // Case 6: Future bill > 7 days, should not trigger due-date notification yet.
        Tagihan::updateOrCreate(
            ['kode_invoice' => 'INV-FUTURE-BUDI'],
            [
                'id_sewa' => $sewaBudi->id_sewa,
                'tanggal_tagihan' => now()->toDateString(),
                'tanggal_jatuh_tempo' => now()->addDays(15)->toDateString(),
                'total_tagihan' => 750000,
                'status_tagihan' => 'belum_bayar',
            ]
        );

        // Keep one available room intentionally for future add-tenant tests.
        $roomAvailable->update([
            'status_kamar' => 'tersedia',
        ]);
    }
}
