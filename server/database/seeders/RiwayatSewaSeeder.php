<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RiwayatSewaSeeder extends Seeder
{
    public function run(): void
    {
        // Data dummy sesuai frontend AdminTambahPenghuni & AdminPenghuni
        // User IDs: 2=Budi Santoso, 3=Siti Aminah, 4=Agus Pratama
        // Kamar: A1=id 1, B3=id 8, C2=id 12
        $data = [
            [
                'id_user'           => 2, // Budi Santoso
                'id_kamar'          => 1, // A1 (Tipe A, Rp 800.000)
                'tanggal_masuk'     => '2024-05-01',
                'tanggal_keluar'    => null,
                'harga_deal'        => 800000,
                'durasi_sewa_bulan' => 12,
                'status_sewa'       => 'aktif',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'id_user'           => 3, // Siti Aminah
                'id_kamar'          => 8, // B3 (Tipe B, Rp 1.000.000)
                'tanggal_masuk'     => '2024-05-10',
                'tanggal_keluar'    => null,
                'harga_deal'        => 1000000,
                'durasi_sewa_bulan' => 6,
                'status_sewa'       => 'aktif',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'id_user'           => 4, // Agus Pratama
                'id_kamar'          => 12, // C2 (Tipe C, Rp 1.500.000)
                'tanggal_masuk'     => '2024-04-15',
                'tanggal_keluar'    => null,
                'harga_deal'        => 1500000,
                'durasi_sewa_bulan' => 3,
                'status_sewa'       => 'aktif',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
        ];

        DB::table('riwayat_sewa')->insert($data);

        // Update status kamar yang terisi
        DB::table('kamar')->whereIn('id_kamar', [1, 8, 12])->update(['status_kamar' => 'terisi']);
    }
}
