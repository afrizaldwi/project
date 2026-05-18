<?php

namespace Database\Seeders;

use App\Models\Kamar;
use App\Models\RiwayatSewa;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SewaExtensionDemoSeeder extends Seeder
{
    public function run(): void
    {
        $penyewa = User::updateOrCreate(
            ['email' => 'raka.pratama@example.com'],
            [
                'password' => Hash::make('password123'),
                'role' => 'penyewa',
                'nama_lengkap' => 'Raka Pratama',
                'no_hp' => '081234567891',
                'alamat_asal' => 'Sidoarjo',
            ]
        );

        $kamar = Kamar::where('nomor_kamar', 'S-01')->firstOrFail();

        $tanggalMasuk = now()->subMonthsNoOverflow(3)->startOfDay();
        $durasiSewa = 4;
        $tanggalKeluar = $tanggalMasuk->copy()->addMonthsNoOverflow($durasiSewa);

        RiwayatSewa::updateOrCreate(
            [
                'id_user' => $penyewa->id,
                'id_kamar' => $kamar->id_kamar,
                'status_sewa' => 'aktif',
            ],
            [
                'tanggal_masuk' => $tanggalMasuk->toDateString(),
                'tanggal_keluar' => $tanggalKeluar->toDateString(),
                'durasi_sewa_bulan' => $durasiSewa,
                'harga_deal' => $kamar->harga_bulanan * $durasiSewa,
            ]
        );

        $kamar->update([
            'status_kamar' => 'terisi',
        ]);
    }
}
