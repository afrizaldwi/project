<?php

namespace Database\Seeders;

use App\Models\Keluhan;
use App\Features\Kamar\Models\Kamar;
use App\Features\Sewa\Models\RiwayatSewa;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class KeluhanSeeder extends Seeder
{
    public function run(): void
    {
        $penyewa = User::updateOrCreate(
            ['email' => 'demo.keluhan.penyewa@example.com'],
            [
                'nama_lengkap' => 'Nadia Putri',
                'password' => Hash::make('password123'),
                'role' => 'penyewa',
                'no_hp' => '081298765432',
                'alamat_asal' => 'Sidoarjo',
            ]
        );

        $kamar = Kamar::updateOrCreate(
            ['nomor_kamar' => 'K-01'],
            [
                'luas_kamar' => '3x4 meter',
                'fasilitas' => 'Kasur, lemari, meja belajar, kipas angin',
                'harga_bulanan' => 850000,
                'status_kamar' => 'terisi',
                'foto_kamar' => null,
            ]
        );

        $tanggalMasuk = now()->subMonthsNoOverflow(2)->startOfDay();
        $durasiSewa = 6;

        $sewa = RiwayatSewa::updateOrCreate(
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

        $budi = User::where('email', 'penyewa@kost.com')->first();
        if ($budi) {
            RiwayatSewa::updateOrCreate(
                [
                    'id_user' => $budi->id,
                    'status_sewa' => 'aktif',
                ],
                [
                    'id_kamar' => $kamar->id_kamar,
                    'tanggal_masuk' => $tanggalMasuk->toDateString(),
                    'tanggal_keluar' => $tanggalMasuk->copy()->addMonthsNoOverflow($durasiSewa)->toDateString(),
                    'durasi_sewa_bulan' => $durasiSewa,
                    'harga_deal' => $kamar->harga_bulanan * $durasiSewa,
                ]
            );
        }

        $keluhanList = [
            [
                'judul_keluhan' => 'Lampu kamar mati',
                'deskripsi_keluhan' => 'Lampu utama kamar tidak menyala sejak tadi malam.',
                'status_keluhan' => 'pending',
                'tanggal_lapor' => now()->subDays(3),
                'tanggal_selesai' => null,
            ],
            [
                'judul_keluhan' => 'Kran kamar mandi bocor',
                'deskripsi_keluhan' => 'Kran air bocor dan terus menetes walaupun sudah ditutup.',
                'status_keluhan' => 'proses',
                'tanggal_lapor' => now()->subDays(2),
                'tanggal_selesai' => null,
            ],
            [
                'judul_keluhan' => 'Engsel pintu longgar',
                'deskripsi_keluhan' => 'Engsel pintu kamar longgar dan perlu diperbaiki.',
                'status_keluhan' => 'selesai',
                'tanggal_lapor' => now()->subDays(7),
                'tanggal_selesai' => now()->subDay(),
            ],
        ];

        foreach ($keluhanList as $keluhan) {
            Keluhan::updateOrCreate(
                [
                    'id_sewa' => $sewa->id_sewa,
                    'judul_keluhan' => $keluhan['judul_keluhan'],
                ],
                [
                    'deskripsi_keluhan' => $keluhan['deskripsi_keluhan'],
                    'foto_kerusakan' => null,
                    'status_keluhan' => $keluhan['status_keluhan'],
                    'tanggal_lapor' => $keluhan['tanggal_lapor'],
                    'tanggal_selesai' => $keluhan['tanggal_selesai'],
                ]
            );
        }
    }
}
