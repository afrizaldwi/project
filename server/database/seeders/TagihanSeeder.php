<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagihanSeeder extends Seeder
{
    public function run(): void
    {
        // Data tagihan (pemasukan) sesuai AdminLaporanKeuangan frontend
        // id_sewa: 1=Budi, 2=Siti, 3=Agus
        $data = [
            [
                'id_sewa'            => 1, // Budi Santoso - Kamar A1
                'kode_invoice'       => 'INV-2026-001',
                'tanggal_tagihan'    => '2026-05-01',
                'tanggal_jatuh_tempo'=> '2026-05-10',
                'total_tagihan'      => 800000,
                'status_tagihan'     => 'lunas',
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
            [
                'id_sewa'            => 2, // Siti Aminah - Kamar B3
                'kode_invoice'       => 'INV-2026-002',
                'tanggal_tagihan'    => '2026-05-02',
                'tanggal_jatuh_tempo'=> '2026-05-12',
                'total_tagihan'      => 1000000,
                'status_tagihan'     => 'lunas',
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
            [
                'id_sewa'            => 3, // Agus Pratama - Kamar C2
                'kode_invoice'       => 'INV-2026-003',
                'tanggal_tagihan'    => '2026-05-03',
                'tanggal_jatuh_tempo'=> '2026-05-13',
                'total_tagihan'      => 1500000,
                'status_tagihan'     => 'lunas',
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
        ];

        DB::table('tagihan')->insert($data);
    }
}
