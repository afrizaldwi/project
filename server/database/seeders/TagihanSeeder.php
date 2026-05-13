<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Str;

class TagihanSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil semua data sewa yang ada
        $sewas = DB::table('riwayat_sewa')->get();

        if ($sewas->isEmpty()) {
            $this->command->warn('TagihanSeeder: Tidak ada data riwayat_sewa. Jalankan SewaSeeder terlebih dahulu.');
            return;
        }

        $tagihans = [];

        foreach ($sewas as $sewa) {
            // Tagihan bulan ini (belum dibayar)
            $tagihans[] = [
                'id_sewa'             => $sewa->id_sewa,
                'kode_invoice'        => 'INV-' . strtoupper(Str::random(8)),
                'tanggal_tagihan'     => Carbon::now()->startOfMonth()->format('Y-m-d'),
                'tanggal_jatuh_tempo' => Carbon::now()->startOfMonth()->addDays(10)->format('Y-m-d'),
                'total_tagihan'       => $sewa->harga_deal,
                'status_tagihan'      => 'belum_bayar',
                'created_at'          => now(),
                'updated_at'          => now(),
            ];

            // Tagihan bulan lalu (sudah lunas)
            $tagihans[] = [
                'id_sewa'             => $sewa->id_sewa,
                'kode_invoice'        => 'INV-' . strtoupper(Str::random(8)),
                'tanggal_tagihan'     => Carbon::now()->subMonth()->startOfMonth()->format('Y-m-d'),
                'tanggal_jatuh_tempo' => Carbon::now()->subMonth()->startOfMonth()->addDays(10)->format('Y-m-d'),
                'total_tagihan'       => $sewa->harga_deal,
                'status_tagihan'      => 'lunas',
                'created_at'          => Carbon::now()->subMonth(),
                'updated_at'          => Carbon::now()->subMonth(),
            ];

            // Tagihan 2 bulan lalu (sudah lunas)
            $tagihans[] = [
                'id_sewa'             => $sewa->id_sewa,
                'kode_invoice'        => 'INV-' . strtoupper(Str::random(8)),
                'tanggal_tagihan'     => Carbon::now()->subMonths(2)->startOfMonth()->format('Y-m-d'),
                'tanggal_jatuh_tempo' => Carbon::now()->subMonths(2)->startOfMonth()->addDays(10)->format('Y-m-d'),
                'total_tagihan'       => $sewa->harga_deal,
                'status_tagihan'      => 'lunas',
                'created_at'          => Carbon::now()->subMonths(2),
                'updated_at'          => Carbon::now()->subMonths(2),
            ];
        }

        DB::table('tagihan')->insert($tagihans);

        $this->command->info('TagihanSeeder: ' . count($tagihans) . ' tagihan berhasil dibuat.');
    }
}