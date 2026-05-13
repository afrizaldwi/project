<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KamarSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('kamar')->insert([
            [
                'nomor_kamar'    => 'A-01',
                'fasilitas'      => 'AC, Kasur, Lemari, WiFi, Meja Belajar',
                'harga_bulanan'  => 1500000.00,
                'luas_kamar'     => '3x4 m',
                'foto_kamar'     => null,
                'status_kamar'   => 'terisi',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'nomor_kamar'    => 'A-02',
                'fasilitas'      => 'AC, Kasur, Lemari, WiFi',
                'harga_bulanan'  => 1200000.00,
                'luas_kamar'     => '3x3 m',
                'foto_kamar'     => null,
                'status_kamar'   => 'tersedia',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'nomor_kamar'    => 'B-01',
                'fasilitas'      => 'AC, Kasur, Lemari, WiFi, Kamar Mandi Dalam, Kulkas',
                'harga_bulanan'  => 2000000.00,
                'luas_kamar'     => '4x5 m',
                'foto_kamar'     => null,
                'status_kamar'   => 'terisi',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'nomor_kamar'    => 'B-02',
                'fasilitas'      => 'AC, Kasur, Lemari, WiFi, Kamar Mandi Dalam',
                'harga_bulanan'  => 1800000.00,
                'luas_kamar'     => '4x4 m',
                'foto_kamar'     => null,
                'status_kamar'   => 'tersedia',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
        ]);
    }
}
