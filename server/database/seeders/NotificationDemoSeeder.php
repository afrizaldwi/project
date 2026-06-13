<?php

namespace Database\Seeders;

use App\Models\Kamar;
use App\Models\RiwayatSewa;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationDemoSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            /*
             * Demo H-7 notification data.
             *
             * Login:
             * email    : demo.h7@kost.com
             * password : password
             *
             * Purpose:
             * Create one active penyewa with one unpaid tagihan
             * where tanggal_jatuh_tempo = today + 7 days.
             *
             * This should trigger the H-7 payment reminder modal
             * without changing real notification logic.
             */

            $harga = 750000;
            $tanggalJatuhTempo = now()->addDays(7)->toDateString();

            $user = User::updateOrCreate(
                ['email' => 'demo.h7@kost.com'],
                [
                    'nama_lengkap' => 'Demo H7 Penyewa',
                    'password' => 'password', // hashed automatically by User cast
                    'role' => 'penyewa',
                    'no_hp' => '6281234567890',
                    'alamat_asal' => 'Data demo H-7',
                ]
            );

            $kamar = Kamar::updateOrCreate(
                ['nomor_kamar' => 'DEMO-H7'],
                [
                    'fasilitas' => 'Kasur, Lemari, Meja Belajar',
                    'harga_bulanan' => $harga,
                    'luas_kamar' => '3x3',
                    'foto_kamar' => null,
                    'status_kamar' => 'terisi',
                ]
            );

            $sewa = RiwayatSewa::updateOrCreate(
                [
                    'id_user' => $user->id,
                    'id_kamar' => $kamar->id_kamar,
                    'status_sewa' => 'aktif',
                ],
                [
                    'tanggal_masuk' => now()->subDays(23)->toDateString(),
                    'tanggal_keluar' => $tanggalJatuhTempo,
                    'harga_deal' => $harga,
                    'durasi_sewa_bulan' => 1,
                ]
            );

            DB::table('tagihan')->updateOrInsert(
                ['kode_invoice' => 'INV-DEMO-H7'],
                [
                    'id_sewa' => $sewa->id_sewa,
                    'tanggal_tagihan' => now()->toDateString(),
                    'tanggal_jatuh_tempo' => $tanggalJatuhTempo,
                    'total_tagihan' => $harga,
                    'status_tagihan' => 'belum_bayar',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        });
    }
}
