<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\BukuTamu;

class BukuTamuSeeder extends Seeder {
    public function run(): void {
        BukuTamu::create([
            'nama_tamu' => 'Andi Wijaya',
            'no_hp_tamu' => '081233334444',
            'bertemu_dengan' => 2, // ID user Budi Santoso (dari UserSeeder)
            'keperluan' => 'Bertamu',
            'waktu_berkunjung' => now(),
        ]);
    }
}
