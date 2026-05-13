<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'email' => 'admin@kost.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'nama_lengkap' => 'Admin Utama',
            'no_hp' => '081234567890',
            'alamat_asal' => 'Surabaya',
        ]);

        User::create([
            'email' => 'budi@kost.com',
            'password' => Hash::make('password123'),
            'role' => 'penyewa',
            'nama_lengkap' => 'Budi Santoso',
            'no_hp' => '089876543210',
            'alamat_asal' => 'Jakarta',
        ]);

        User::create([
            'email' => 'siti@kost.com',
            'password' => Hash::make('password123'),
            'role' => 'penyewa',
            'nama_lengkap' => 'Siti Aminah',
            'no_hp' => '087654321098',
            'alamat_asal' => 'Bandung',
        ]);

        User::create([
            'email' => 'agus@kost.com',
            'password' => Hash::make('password123'),
            'role' => 'penyewa',
            'nama_lengkap' => 'Agus Pratama',
            'no_hp' => '081122334455',
            'alamat_asal' => 'Jogja',
        ]);
    }
}
