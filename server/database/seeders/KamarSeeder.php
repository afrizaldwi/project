<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kamar;

class KamarSeeder extends Seeder
{
    public function run(): void
    {
        Kamar::create([
            'nomor_kamar' => 'A-01',
            'fasilitas' => 'AC, Kasur, Lemari, Kamar Mandi Dalam',
            'harga_bulanan' => 1500000,
            'luas_kamar' => '3x4 Meter',
            'status_kamar' => 'tersedia',
        ]);

        Kamar::create([
            'nomor_kamar' => 'B-01',
            'fasilitas' => 'Kipas Angin, Kasur, Lemari, Kamar Mandi Luar',
            'harga_bulanan' => 800000,
            'luas_kamar' => '3x3 Meter',
            'status_kamar' => 'terisi',
        ]);
    }
}
