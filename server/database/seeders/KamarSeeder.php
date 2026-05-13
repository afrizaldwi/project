<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KamarSeeder extends Seeder
{
    public function run(): void
    {
        $tipeKamar = [
            ['tipe' => 'A', 'harga' => 800000, 'fasilitas' => 'Fasilitas Dasar', 'luas' => '3x3'],
            ['tipe' => 'B', 'harga' => 1000000, 'fasilitas' => 'AC + Kamar Mandi Dalam', 'luas' => '3x4'],
            ['tipe' => 'C', 'harga' => 1500000, 'fasilitas' => 'VIP + Kulkas', 'luas' => '4x4'],
        ];

        foreach ($tipeKamar as $t) {
            for ($i = 1; $i <= 5; $i++) {
                DB::table('kamar')->insert([
                    'nomor_kamar' => $t['tipe'] . $i,
                    'fasilitas' => $t['fasilitas'],
                    'harga_bulanan' => $t['harga'],
                    'luas_kamar' => $t['luas'],
                    'status_kamar' => ($t['tipe'] == 'C' && $i == 2) ? 'terisi' : 'tersedia', // One room taken as dummy
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
