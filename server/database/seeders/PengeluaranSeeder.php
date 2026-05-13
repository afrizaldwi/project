<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PengeluaranSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('pengeluaran')->insert([
            [
                'judul_pengeluaran' => 'Tagihan Listrik Bulan Mei',
                'deskripsi' => 'Pembayaran listrik rutin bulanan',
                'jumlah_pengeluaran' => 450000,
                'tanggal_pengeluaran' => '2026-05-03',
                'dibuat_oleh' => 1, // Admin
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'judul_pengeluaran' => 'Perbaikan Keran Air Kamar 03',
                'deskripsi' => 'Penggantian keran air yang bocor',
                'jumlah_pengeluaran' => 75000,
                'tanggal_pengeluaran' => '2026-05-05',
                'dibuat_oleh' => 1, // Admin
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
