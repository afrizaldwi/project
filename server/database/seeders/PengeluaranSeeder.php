<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PengeluaranSeeder extends Seeder
{
    public function run(): void
    {
        // Pengeluaran operasional untuk laporan keuangan (dibuat_oleh=1 = admin)
        DB::table('pengeluaran')->insert([
            [
                'judul_pengeluaran'   => 'Tagihan Listrik Bulan Maret',
                'deskripsi'           => 'Pembayaran tagihan listrik PLN bulan Maret 2026',
                'jumlah_pengeluaran'  => 450000.00,
                'tanggal_pengeluaran' => '2026-03-05',
                'bukti_foto'          => null,
                'dibuat_oleh'         => 1,
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'judul_pengeluaran'   => 'Tagihan Air PDAM Bulan Maret',
                'deskripsi'           => 'Pembayaran tagihan air PDAM bulan Maret 2026',
                'jumlah_pengeluaran'  => 120000.00,
                'tanggal_pengeluaran' => '2026-03-07',
                'bukti_foto'          => null,
                'dibuat_oleh'         => 1,
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'judul_pengeluaran'   => 'Perbaikan Keran Air Kamar A-02',
                'deskripsi'           => 'Biaya jasa tukang dan material perbaikan keran',
                'jumlah_pengeluaran'  => 75000.00,
                'tanggal_pengeluaran' => '2026-03-15',
                'bukti_foto'          => null,
                'dibuat_oleh'         => 1,
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'judul_pengeluaran'   => 'Tagihan Listrik Bulan April',
                'deskripsi'           => 'Pembayaran tagihan listrik PLN bulan April 2026',
                'jumlah_pengeluaran'  => 430000.00,
                'tanggal_pengeluaran' => '2026-04-05',
                'bukti_foto'          => null,
                'dibuat_oleh'         => 1,
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'judul_pengeluaran'   => 'Tagihan Air PDAM Bulan April',
                'deskripsi'           => 'Pembayaran tagihan air PDAM bulan April 2026',
                'jumlah_pengeluaran'  => 115000.00,
                'tanggal_pengeluaran' => '2026-04-07',
                'bukti_foto'          => null,
                'dibuat_oleh'         => 1,
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'judul_pengeluaran'   => 'Pembelian Peralatan Kebersihan',
                'deskripsi'           => 'Sapu, pel, sabun, dan perlengkapan bersih-bersih',
                'jumlah_pengeluaran'  => 200000.00,
                'tanggal_pengeluaran' => '2026-05-02',
                'bukti_foto'          => null,
                'dibuat_oleh'         => 1,
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'judul_pengeluaran'   => 'Tagihan Listrik Bulan Mei',
                'deskripsi'           => 'Pembayaran tagihan listrik PLN bulan Mei 2026',
                'jumlah_pengeluaran'  => 460000.00,
                'tanggal_pengeluaran' => '2026-05-05',
                'bukti_foto'          => null,
                'dibuat_oleh'         => 1,
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
        ]);
    }
}
