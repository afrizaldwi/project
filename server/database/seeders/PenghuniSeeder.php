<?php

namespace Database\Seeders;

use App\Models\Kamar;
use App\Models\RiwayatSewa;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PenghuniSeeder extends Seeder
{
    public function run(): void
    {
        $penghuniData = [
            [
                'nama_lengkap'  => 'Budi Santoso',
                'email'         => 'budi@kost.com',
                'no_hp'         => '085123456789',
                'alamat_asal'   => 'Surabaya',
                'nomor_kamar'   => 'A1',
                'tanggal_masuk' => '2026-05-16',
                'durasi'        =>  1,
            ],
        ];

        foreach ($penghuniData as $p) {
            $kamar = Kamar::where('nomor_kamar', $p['nomor_kamar'])->first();
            if (!$kamar) continue;

            // Cek apakah user dengan email ini sudah ada (hindari duplikat)
            $user = User::firstOrCreate(
                ['email' => $p['email']],
                [
                    'nama_lengkap' => $p['nama_lengkap'],
                    'password'     => Hash::make('password123'),
                    'role'         => 'penyewa',
                    'no_hp'        => $p['no_hp'],
                    'alamat_asal'  => 'Surabaya',
                ]
            );

            $tanggalKeluar = Carbon::parse($p['tanggal_masuk'])
                ->addMonths($p['durasi'])
                ->toDateString();

            RiwayatSewa::create([
                'id_user'           => $user->id,
                'id_kamar'          => $kamar->id_kamar,
                'tanggal_masuk'     => $p['tanggal_masuk'],
                'tanggal_keluar'    => $tanggalKeluar,
                'harga_deal'        => $kamar->harga_bulanan * $p['durasi'],
                'durasi_sewa_bulan' => $p['durasi'],
                'status_sewa'       => 'aktif',
            ]);

            // Update status kamar menjadi terisi
            $kamar->update(['status_kamar' => 'terisi']);
        }
    }
}