<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KamarSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('kamar')->insert([
            'nomor_kamar' => 'A-01',
            'fasilitas' => 'AC, Kamar Mandi Dalam, Kasur Queen Size',
            'harga_bulanan' => 1500000,
            'luas_kamar' => '3x4 meter',
            'status_kamar' => 'terisi',
            'created_at' => now(),
        ]);
    }
}