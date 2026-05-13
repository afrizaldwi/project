<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SewaSeeder extends Seeder
{
    public function run(): void
    {
        // users pakai kolom 'id' (default Laravel), bukan 'id_user'
        $user = DB::table('users')->where('role', 'penyewa')->first();
        $kamar = DB::table('kamar')->first();

        if ($user && $kamar) {
            DB::table('riwayat_sewa')->insert([
                'id_user'      => $user->id,   // kolom FK ke users.id
                'id_kamar'     => $kamar->id_kamar,
                'tanggal_masuk'=> now()->subMonth()->toDateString(),
                'harga_deal'   => $kamar->harga_bulanan,
                'status_sewa'  => 'aktif',
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
        }
    }
}