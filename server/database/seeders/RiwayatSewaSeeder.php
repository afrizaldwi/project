<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RiwayatSewaSeeder extends Seeder
{
    public function run(): void
    {
        // Penyewa (id=2 dari UserSeeder) menyewa kamar A-01 (id_kamar=1)
        DB::table('riwayat_sewa')->insert([
            [
                'id_user'           => 2,
                'id_kamar'          => 1,
                'tanggal_masuk'     => '2026-03-01',
                'tanggal_keluar'    => null,
                'harga_deal'        => 1500000.00,
                'durasi_sewa_bulan' => 6,
                'status_sewa'       => 'aktif',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'id_user'           => 2,
                'id_kamar'          => 3,
                'tanggal_masuk'     => '2025-09-01',
                'tanggal_keluar'    => '2026-02-28',
                'harga_deal'        => 2000000.00,
                'durasi_sewa_bulan' => 6,
                'status_sewa'       => 'selesai',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
        ]);
    }
}
