<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RiwayatSewa;
use App\Models\User;
use App\Models\Kamar;
use Carbon\Carbon;

class RiwayatSewaSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'penyewa@kost.com')->first();
        $kamar = Kamar::where('nomor_kamar', 'A01')->first();

        if ($user && $kamar) {
            RiwayatSewa::create([
                'id_user' => $user->id,
                'id_kamar' => $kamar->id_kamar,
                'tanggal_masuk' => Carbon::now()->subMonths(1)->toDateString(),
                'harga_deal' => $kamar->harga_bulanan,
                'durasi_sewa_bulan' => 12,
                'status_sewa' => 'aktif',
            ]);
        }
    }
}
