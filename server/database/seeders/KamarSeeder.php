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
                'nomor_kamar' => 'S-01',
                'luas_kamar' => '3x4 meter',
                'fasilitas' => 'Kasur, lemari, meja belajar, kipas angin, kamar mandi luar',
                'harga_bulanan' => 850000,
                'status_kamar' => 'terisi',
                'foto_kamar' => null,
            ],
            [
                'nomor_kamar' => 'S-02',
                'luas_kamar' => '3x4 meter',
                'fasilitas' => 'Kasur, lemari, meja belajar, kipas angin',
                'harga_bulanan' => 800000,
                'status_kamar' => 'tersedia',
                'foto_kamar' => null,
            ],
            [
                'nomor_kamar' => 'S-03',
                'luas_kamar' => '4x4 meter',
                'fasilitas' => 'Kasur, lemari, meja belajar, AC, kamar mandi dalam',
                'harga_bulanan' => 1200000,
                'status_kamar' => 'perbaikan',
                'foto_kamar' => null,
            ],
            [
                'nomor_kamar' => 'S-04',
                'luas_kamar' => '3x3 meter',
                'fasilitas' => 'Kasur, lemari, kipas angin',
                'harga_bulanan' => 700000,
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
