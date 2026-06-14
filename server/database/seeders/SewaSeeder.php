<?php

namespace Database\Seeders;

use App\Features\Kamar\Models\Kamar;
use App\Features\Sewa\Models\RiwayatSewa;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SewaSeeder extends Seeder
{
    public function run(): void
    {
        $penyewa = User::updateOrCreate(
            ['email' => 'raka.pratama@kost.com'],
            [
                'password' => Hash::make('password123'),
                'role' => 'penyewa',
                'nama_lengkap' => 'Raka Pratama',
                'no_hp' => '081234567891',
                'alamat_asal' => 'Sidoarjo',
            ]
        );

        $kamar = Kamar::where('nomor_kamar', 'A1')->firstOrFail();

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
