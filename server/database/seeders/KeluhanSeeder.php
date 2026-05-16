<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KeluhanSeeder extends Seeder {
    public function run(): void {
        // 1. Buat riwayat sewa (sesuai kolom di PostgreSQL)
       $id_sewa = DB::table('riwayat_sewa')->insertGetId([
    'id_user' => 2,
    'id_kamar' => 1,
    'tanggal_masuk' => now()->format('Y-m-d'),
    'harga_deal' => 800000,
    'durasi_sewa_bulan' => 1,
    'status_sewa' => 'aktif',
    'created_at' => now(),
    'updated_at' => now(),
], 'id_sewa'); 


        // 2. Buat keluhan
        DB::table('keluhan')->insert([
            'id_sewa' => $id_sewa,
            'judul_keluhan' => 'Keran Bocor',
            'deskripsi_keluhan' => 'Keran air di kamar mandi bocor, tolong diperbaiki.',
            'status_keluhan' => 'pending',
            'foto_kerusakan' => null,
            'tanggal_lapor' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
