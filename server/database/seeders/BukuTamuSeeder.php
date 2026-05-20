<?php

namespace Database\Seeders;

use App\Models\BukuTamu;
use App\Models\Kamar;
use App\Models\RiwayatSewa;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BukuTamuSeeder extends Seeder
{
    public function run(): void
    {
        $penyewa = User::updateOrCreate(
            ['email' => 'demo.tamu.penyewa@example.com'],
            [
                'nama_lengkap' => 'Dimas Saputra',
                'password' => Hash::make('password123'),
                'role' => 'penyewa',
                'no_hp' => '081234567890',
                'alamat_asal' => 'Surabaya',
            ]
        );

        $kamar = Kamar::updateOrCreate(
            ['nomor_kamar' => 'T-01'],
            [
                'luas_kamar' => '3x4 meter',
                'fasilitas' => 'Kasur, lemari, meja belajar, kipas angin',
                'harga_bulanan' => 850000,
                'status_kamar' => 'terisi',
                'foto_kamar' => null,
            ]
        );

        $tanggalMasuk = now()->subMonthNoOverflow()->startOfDay();
        $durasiSewa = 6;

        RiwayatSewa::updateOrCreate(
            [
                'id_user' => $penyewa->id,
                'id_kamar' => $kamar->id_kamar,
                'status_sewa' => 'aktif',
            ],
            [
                'tanggal_masuk' => $tanggalMasuk->toDateString(),
                'tanggal_keluar' => $tanggalMasuk->copy()->addMonthsNoOverflow($durasiSewa)->toDateString(),
                'durasi_sewa_bulan' => $durasiSewa,
                'harga_deal' => $kamar->harga_bulanan * $durasiSewa,
            ]
        );

        $tamuList = [
            [
                'nama_tamu' => 'Andi Wijaya',
                'no_hp_tamu' => '081111111111',
                'bertemu_dengan' => $penyewa->id,
                'keperluan' => 'Mengantar dokumen pribadi',
                'waktu_berkunjung' => now()->subDays(2)->setTime(15, 30),
            ],
            [
                'nama_tamu' => 'Siti Rahma',
                'no_hp_tamu' => '082222222222',
                'bertemu_dengan' => $penyewa->id,
                'keperluan' => 'Berkunjung keluarga',
                'waktu_berkunjung' => now()->subDay()->setTime(10, 15),
            ],
            [
                'nama_tamu' => 'Budi Santoso',
                'no_hp_tamu' => '083333333333',
                'bertemu_dengan' => $penyewa->id,
                'keperluan' => 'Mengambil barang',
                'waktu_berkunjung' => now()->setTime(19, 0),
            ],
        ];

        foreach ($tamuList as $tamu) {
            BukuTamu::updateOrCreate(
                [
                    'nama_tamu' => $tamu['nama_tamu'],
                    'bertemu_dengan' => $tamu['bertemu_dengan'],
                    'waktu_berkunjung' => $tamu['waktu_berkunjung'],
                ],
                $tamu
            );
        }
    }
}
