<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kamar;

class KamarSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = [
            ['nomor_kamar' => 'A01', 'harga_bulanan' => 1500000, 'status_kamar' => 'terisi', 'fasilitas' => 'AC, Kamar Mandi Dalam, Kasur, Lemari'],
            ['nomor_kamar' => 'A02', 'harga_bulanan' => 1500000, 'status_kamar' => 'tersedia', 'fasilitas' => 'AC, Kamar Mandi Dalam, Kasur, Lemari'],
            ['nomor_kamar' => 'B01', 'harga_bulanan' => 1200000, 'status_kamar' => 'tersedia', 'fasilitas' => 'Kipas Angin, Kamar Mandi Luar, Kasur'],
            ['nomor_kamar' => 'B02', 'harga_bulanan' => 1200000, 'status_kamar' => 'perbaikan', 'fasilitas' => 'Kipas Angin, Kamar Mandi Luar, Kasur'],
        ];

        foreach ($rooms as $room) {
            Kamar::create($room);
        }
    }
}
