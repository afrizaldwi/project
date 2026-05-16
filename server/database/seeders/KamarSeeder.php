<?php

namespace Database\Seeders;

use App\Models\Kamar;
use Illuminate\Database\Seeder;

class KamarSeeder extends Seeder
{
    public function run(): void
    {
        $kamar = [
            [
                'nomor_kamar'   => 'A1',
                'luas_kamar'    => '3x4 m',
                'harga_bulanan' => 1000000,
                'status_kamar'  => 'terisi',
                'fasilitas'     => json_encode(['Kasur, Lemari, Meja Belajar, Kamar Mandi Dalam, AC, TV, Kulkas, Dapur Bersama, Wifi, Parkir, CCTV']),
                'foto_kamar'    => null,
            ],
            
            [
                'nomor_kamar'   => 'B1',
                'luas_kamar'    => '4x4 m',
                'harga_bulanan' => 1250000,
                'status_kamar'  => 'tersedia',
                'fasilitas'     => json_encode(['Kasur, Lemari, Meja Belajar, Kamar Mandi Dalam, Air Panas, AC, TV, Kulkas, Dapur Bersama, Wifi, Parkir, CCTV']),
                'foto_kamar'    => null,
            ],
            
            [
                'nomor_kamar'   => 'C1',
                'luas_kamar'    => '4x5 m',
                'harga_bulanan' => 1500000,
                'status_kamar'  => 'tersedia',
                'fasilitas'     => json_encode(['Kasur, Lemari, Meja Belajar, Kamar Mandi Dalam, Air Panas, AC, TV, Kulkas, Dapur Bersama, Mesin Cuci, Wifi, Parkir, CCTV']),
                'foto_kamar'    => null,
            ],
            
        ];

        foreach ($kamar as $data) {
            Kamar::create($data);
        }
    }
}