<?php

namespace Database\Seeders;

use App\Models\Kamar;
use Illuminate\Database\Seeder;

class KamarSeeder extends Seeder
{
    public function run(): void
    {
        $kamarList = [
            [
                'nomor_kamar' => 'A1',
                'luas_kamar' => '3x4 meter',
                'fasilitas' => 'Kasur, Lemari, Meja Belajar, Kamar Mandi Dalam, AC, TV, Kulkas, Dapur Bersama, Wifi, Parkir, CCTV',
                'harga_bulanan' => 1000000,
                'status_kamar' => 'terisi',
                'foto_kamar' => null,
            ],
            [
                'nomor_kamar' => 'B1',
                'luas_kamar' => '4x4 meter',
                'fasilitas' => 'Kasur, Lemari, Meja Belajar, Kamar Mandi Dalam, Air Panas, AC, TV, Kulkas, Dapur Bersama, Wifi, Parkir, CCTV',
                'harga_bulanan' => 1250000,
                'status_kamar' => 'tersedia',
                'foto_kamar' => null,
            ],
            [
                'nomor_kamar' => 'C1',
                'luas_kamar' => '4x5 meter',
                'fasilitas' => 'Kasur, Lemari, Meja Belajar, Kamar Mandi Dalam, Air Panas, AC, TV, Kulkas, Dapur Bersama, Mesin Cuci, Wifi, Parkir, CCTV',
                'harga_bulanan' => 1500000,
                'status_kamar' => 'tersedia',
                'foto_kamar' => null,
            ],
            
        ];

        foreach ($kamarList as $kamar) {
            Kamar::updateOrCreate(
                ['nomor_kamar' => $kamar['nomor_kamar']],
                $kamar
            );
        }
    }
}
