<?php

namespace Database\Seeders;

use App\Features\BukuTamu\Models\BukuTamu;
use App\Models\Kamar;
use App\Features\Keluhan\Models\Keluhan;
use App\Models\Notifikasi;
use App\Models\Pembayaran;
use App\Models\Pengeluaran;
use App\Models\RiwayatSewa;
use App\Models\Tagihan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class IntegratedDemoSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Demo Accounts
        |--------------------------------------------------------------------------
        */

        $admin = User::updateOrCreate(
            ['email' => 'admin@kost.com'],
            [
                'nama_lengkap' => 'Admin Kost',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'no_hp' => '081111111111',
                'alamat_asal' => 'Sidoarjo',
                'foto_profil' => null,
            ]
        );

        $raka = User::updateOrCreate(
            ['email' => 'raka@kost.com'],
            [
                'nama_lengkap' => 'Raka Pratama',
                'password' => Hash::make('password123'),
                'role' => 'penyewa',
                'no_hp' => '082222222222',
                'alamat_asal' => 'Surabaya',
                'foto_profil' => null,
            ]
        );

        $nadia = User::updateOrCreate(
            ['email' => 'nadia@kost.com'],
            [
                'nama_lengkap' => 'Nadia Putri',
                'password' => Hash::make('password123'),
                'role' => 'penyewa',
                'no_hp' => '083333333333',
                'alamat_asal' => 'Gresik',
                'foto_profil' => null,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Kamar
        |--------------------------------------------------------------------------
        */

        $kamarA01 = Kamar::updateOrCreate(
            ['nomor_kamar' => 'A-01'],
            [
                'luas_kamar' => '3x4 meter',
                'fasilitas' => 'Kasur, lemari, meja belajar, kipas angin',
                'harga_bulanan' => 850000,
                'status_kamar' => 'terisi',
                'foto_kamar' => null,
            ]
        );

        $kamarA02 = Kamar::updateOrCreate(
            ['nomor_kamar' => 'A-02'],
            [
                'luas_kamar' => '3x4 meter',
                'fasilitas' => 'Kasur, lemari, meja belajar, AC',
                'harga_bulanan' => 1200000,
                'status_kamar' => 'terisi',
                'foto_kamar' => null,
            ]
        );

        Kamar::updateOrCreate(
            ['nomor_kamar' => 'A-03'],
            [
                'luas_kamar' => '3x3 meter',
                'fasilitas' => 'Kasur, lemari, kipas angin',
                'harga_bulanan' => 750000,
                'status_kamar' => 'tersedia',
                'foto_kamar' => null,
            ]
        );

        Kamar::updateOrCreate(
            ['nomor_kamar' => 'A-04'],
            [
                'luas_kamar' => '4x4 meter',
                'fasilitas' => 'Kasur, lemari, meja belajar, kamar mandi dalam',
                'harga_bulanan' => 1300000,
                'status_kamar' => 'perbaikan',
                'foto_kamar' => null,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Riwayat Sewa
        |--------------------------------------------------------------------------
        */

        $rakaTanggalMasuk = Carbon::now()->subMonthsNoOverflow(3)->startOfDay();
        $rakaDurasi = 6;

        $sewaRaka = RiwayatSewa::updateOrCreate(
            [
                'id_user' => $raka->id,
                'id_kamar' => $kamarA01->id_kamar,
                'status_sewa' => 'aktif',
            ],
            [
                'tanggal_masuk' => $rakaTanggalMasuk->toDateString(),
                'tanggal_keluar' => $rakaTanggalMasuk->copy()->addMonthsNoOverflow($rakaDurasi)->toDateString(),
                'durasi_sewa_bulan' => $rakaDurasi,
                'harga_deal' => 850000 * $rakaDurasi,
            ]
        );

        $nadiaTanggalMasuk = Carbon::now()->subMonthsNoOverflow(1)->startOfDay();
        $nadiaDurasi = 4;

        $sewaNadia = RiwayatSewa::updateOrCreate(
            [
                'id_user' => $nadia->id,
                'id_kamar' => $kamarA02->id_kamar,
                'status_sewa' => 'aktif',
            ],
            [
                'tanggal_masuk' => $nadiaTanggalMasuk->toDateString(),
                'tanggal_keluar' => $nadiaTanggalMasuk->copy()->addMonthsNoOverflow($nadiaDurasi)->toDateString(),
                'durasi_sewa_bulan' => $nadiaDurasi,
                'harga_deal' => 1200000 * $nadiaDurasi,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Tagihan
        |--------------------------------------------------------------------------
        */

        $tagihanRakaBelumBayar = Tagihan::updateOrCreate(
            ['kode_invoice' => 'INV-RAKA-BELUM-BAYAR'],
            [
                'id_sewa' => $sewaRaka->id_sewa,
                'tanggal_tagihan' => now()->subDays(2)->toDateString(),
                'tanggal_jatuh_tempo' => now()->addDays(5)->toDateString(),
                'total_tagihan' => 850000,
                'status_tagihan' => 'belum_bayar',
            ]
        );

        $tagihanRakaLunas = Tagihan::updateOrCreate(
            ['kode_invoice' => 'INV-RAKA-LUNAS'],
            [
                'id_sewa' => $sewaRaka->id_sewa,
                'tanggal_tagihan' => now()->subMonthNoOverflow()->startOfMonth()->toDateString(),
                'tanggal_jatuh_tempo' => now()->subMonthNoOverflow()->startOfMonth()->addDays(7)->toDateString(),
                'total_tagihan' => 850000,
                'status_tagihan' => 'lunas',
            ]
        );

        $tagihanNadiaTelat = Tagihan::updateOrCreate(
            ['kode_invoice' => 'INV-NADIA-TELAT'],
            [
                'id_sewa' => $sewaNadia->id_sewa,
                'tanggal_tagihan' => now()->subDays(15)->toDateString(),
                'tanggal_jatuh_tempo' => now()->subDays(7)->toDateString(),
                'total_tagihan' => 1200000,
                'status_tagihan' => 'telat',
            ]
        );

        $tagihanNadiaPending = Tagihan::updateOrCreate(
            ['kode_invoice' => 'INV-NADIA-PENDING'],
            [
                'id_sewa' => $sewaNadia->id_sewa,
                'tanggal_tagihan' => now()->subDays(4)->toDateString(),
                'tanggal_jatuh_tempo' => now()->addDays(3)->toDateString(),
                'total_tagihan' => 1200000,
                'status_tagihan' => 'belum_bayar',
            ]
        );

        $tagihanNadiaDitolak = Tagihan::updateOrCreate(
            ['kode_invoice' => 'INV-NADIA-DITOLAK'],
            [
                'id_sewa' => $sewaNadia->id_sewa,
                'tanggal_tagihan' => now()->subMonthNoOverflow()->toDateString(),
                'tanggal_jatuh_tempo' => now()->subMonthNoOverflow()->addDays(7)->toDateString(),
                'total_tagihan' => 1200000,
                'status_tagihan' => 'belum_bayar',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Pembayaran
        |--------------------------------------------------------------------------
        */

        Pembayaran::updateOrCreate(
            [
                'id_tagihan' => $tagihanRakaLunas->id_tagihan,
                'status_verifikasi' => 'diterima',
            ],
            [
                'tanggal_bayar' => now()->subMonthNoOverflow()->addDays(3)->toDateString(),
                'jumlah_bayar' => 850000,
                'metode_pembayaran' => 'Transfer Bank',
                'bukti_bayar' => null,
                'catatan_admin' => 'Pembayaran diterima.',
            ]
        );

        Pembayaran::updateOrCreate(
            [
                'id_tagihan' => $tagihanNadiaPending->id_tagihan,
                'status_verifikasi' => 'pending',
            ],
            [
                'tanggal_bayar' => now()->subDay()->toDateString(),
                'jumlah_bayar' => 1200000,
                'metode_pembayaran' => 'Transfer Bank',
                'bukti_bayar' => null,
                'catatan_admin' => null,
            ]
        );

        Pembayaran::updateOrCreate(
            [
                'id_tagihan' => $tagihanNadiaDitolak->id_tagihan,
                'status_verifikasi' => 'ditolak',
            ],
            [
                'tanggal_bayar' => now()->subDays(10)->toDateString(),
                'jumlah_bayar' => 1200000,
                'metode_pembayaran' => 'Transfer Bank',
                'bukti_bayar' => null,
                'catatan_admin' => 'Bukti pembayaran tidak jelas.',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Notifikasi
        |--------------------------------------------------------------------------
        */

        Notifikasi::updateOrCreate(
            [
                'id_user' => $raka->id,
                'id_tagihan' => $tagihanRakaBelumBayar->id_tagihan,
                'tipe' => 'reminder_jatuh_tempo',
            ],
            [
                'role_target' => 'penyewa',
                'judul' => 'Tagihan Akan Jatuh Tempo',
                'pesan' => 'Tagihan INV-RAKA-BELUM-BAYAR akan jatuh tempo dalam beberapa hari.',
                'is_read' => false,
                'read_at' => null,
                'pushed_at' => null,
                'last_reminded_at' => now()->toDateString(),
                'reminder_count' => 1,
            ]
        );

        Notifikasi::updateOrCreate(
            [
                'id_user' => $admin->id,
                'id_tagihan' => $tagihanNadiaPending->id_tagihan,
                'tipe' => 'pembayaran_pending',
            ],
            [
                'role_target' => 'admin',
                'judul' => 'Pembayaran Menunggu Verifikasi',
                'pesan' => 'Pembayaran Nadia Putri menunggu verifikasi admin.',
                'is_read' => false,
                'read_at' => null,
                'pushed_at' => null,
                'last_reminded_at' => now()->toDateString(),
                'reminder_count' => 1,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Buku Tamu
        |--------------------------------------------------------------------------
        */

        BukuTamu::updateOrCreate(
            [
                'nama_tamu' => 'Andi Wijaya',
                'bertemu_dengan' => $raka->id,
                'keperluan' => 'Mengantar dokumen',
            ],
            [
                'no_hp_tamu' => '081234567801',
                'waktu_berkunjung' => now()->subDays(2)->setTime(15, 30),
            ]
        );

        BukuTamu::updateOrCreate(
            [
                'nama_tamu' => 'Siti Rahma',
                'bertemu_dengan' => $nadia->id,
                'keperluan' => 'Berkunjung keluarga',
            ],
            [
                'no_hp_tamu' => '081234567802',
                'waktu_berkunjung' => now()->subDay()->setTime(10, 15),
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Keluhan
        |--------------------------------------------------------------------------
        */

        Keluhan::updateOrCreate(
            [
                'id_sewa' => $sewaRaka->id_sewa,
                'judul_keluhan' => 'Lampu kamar mati',
            ],
            [
                'deskripsi_keluhan' => 'Lampu utama kamar tidak menyala sejak tadi malam.',
                'foto_kerusakan' => null,
                'status_keluhan' => 'pending',
                'tanggal_lapor' => now()->subDays(3),
                'tanggal_selesai' => null,
            ]
        );

        Keluhan::updateOrCreate(
            [
                'id_sewa' => $sewaNadia->id_sewa,
                'judul_keluhan' => 'Kran kamar mandi bocor',
            ],
            [
                'deskripsi_keluhan' => 'Kran air bocor dan terus menetes.',
                'foto_kerusakan' => null,
                'status_keluhan' => 'proses',
                'tanggal_lapor' => now()->subDays(2),
                'tanggal_selesai' => null,
            ]
        );

        Keluhan::updateOrCreate(
            [
                'id_sewa' => $sewaRaka->id_sewa,
                'judul_keluhan' => 'Engsel pintu longgar',
            ],
            [
                'deskripsi_keluhan' => 'Engsel pintu kamar longgar dan perlu diperbaiki.',
                'foto_kerusakan' => null,
                'status_keluhan' => 'selesai',
                'tanggal_lapor' => now()->subDays(8),
                'tanggal_selesai' => now()->subDay(),
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Pengeluaran
        |--------------------------------------------------------------------------
        */

        Pengeluaran::updateOrCreate(
            [
                'tanggal_pengeluaran' => now()->startOfMonth()->addDays(2)->toDateString(),
                'judul_pengeluaran' => 'Perbaikan kran kamar mandi',
            ],
            [
                'deskripsi' => 'Biaya perbaikan kran kamar mandi yang bocor.',
                'jumlah_pengeluaran' => 150000,
                'bukti_foto' => null,
                'dibuat_oleh' => $admin->id,
            ]
        );

        Pengeluaran::updateOrCreate(
            [
                'tanggal_pengeluaran' => now()->startOfMonth()->addDays(5)->toDateString(),
                'judul_pengeluaran' => 'Pembelian alat kebersihan',
            ],
            [
                'deskripsi' => 'Pembelian sapu, pel, cairan pembersih, dan perlengkapan kebersihan kost.',
                'jumlah_pengeluaran' => 100000,
                'bukti_foto' => null,
                'dibuat_oleh' => $admin->id,
            ]
        );
    }
}
