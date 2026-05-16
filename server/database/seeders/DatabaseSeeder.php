<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            KamarSeeder::class,
            PenghuniSeeder::class, // ← tambahan: seed data penghuni di kamar A1
        ]);
    }
}