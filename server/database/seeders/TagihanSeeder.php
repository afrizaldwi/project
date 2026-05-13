<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagihanSeeder extends Seeder
{
    public function run(): void
    {
        // Tagihan untuk sewa aktif (id_sewa=1, kamar A-01, mulai Maret 2026)
        DB::table('tagihan')->insert([
            [
                'id_sewa'             => 1,
                'kode_invoice'        => 'INV-2026-0001',
                'tanggal_tagihan'     => '2026-03-01',
                'tanggal_jatuh_tempo' => '2026-03-11',
                'total_tagihan'       => 1500000.00,
                'status_tagihan'      => 'lunas',
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'id_sewa'             => 1,
                'kode_invoice'        => 'INV-2026-0002',
                'tanggal_tagihan'     => '2026-04-01',
                'tanggal_jatuh_tempo' => '2026-04-11',
                'total_tagihan'       => 1500000.00,
                'status_tagihan'      => 'lunas',
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'id_sewa'             => 1,
                'kode_invoice'        => 'INV-2026-0003',
                'tanggal_tagihan'     => '2026-05-01',
                'tanggal_jatuh_tempo' => '2026-05-11',
                'total_tagihan'       => 1500000.00,
                'status_tagihan'      => 'belum_bayar',
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'id_sewa'             => 1,
                'kode_invoice'        => 'INV-2026-0004',
                'tanggal_tagihan'     => '2026-06-01',
                'tanggal_jatuh_tempo' => '2026-06-11',
                'total_tagihan'       => 1500000.00,
                'status_tagihan'      => 'belum_bayar',
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
        ]);
    }
}
