<?php

namespace Database\Seeders;

use App\Models\Kamar;
use App\Models\Pembayaran;
use App\Models\Pengeluaran;
use App\Models\RiwayatSewa;
use App\Models\Tagihan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminPenghuniLaporanSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $admin = User::updateOrCreate(
            ['email' => 'admin@kost.com'],
            [
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'nama_lengkap' => 'Admin Utama',
                'no_hp' => '081234567890',
                'alamat_asal' => 'Surabaya',
            ]
        );

        $penyewaData = [
            [
                'email' => 'budi@kost.com',
                'nama_lengkap' => 'Budi Santoso',
                'no_hp' => '081111111111',
                'alamat_asal' => 'Jakarta',
            ],
            [
                'email' => 'siti@kost.com',
                'nama_lengkap' => 'Siti Aminah',
                'no_hp' => '082222222222',
                'alamat_asal' => 'Malang',
            ],
            [
                'email' => 'andi@kost.com',
                'nama_lengkap' => 'Andi Pratama',
                'no_hp' => '083333333333',
                'alamat_asal' => 'Sidoarjo',
            ],
            [
                'email' => 'rina@kost.com',
                'nama_lengkap' => 'Rina Lestari',
                'no_hp' => '084444444444',
                'alamat_asal' => 'Gresik',
            ],
        ];

        $penyewaUsers = collect($penyewaData)->map(function (array $data) {
            return User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'password' => Hash::make('password123'),
                    'role' => 'penyewa',
                    'nama_lengkap' => $data['nama_lengkap'],
                    'no_hp' => $data['no_hp'],
                    'alamat_asal' => $data['alamat_asal'],
                ]
            );
        });

        $kamarData = [
            [
                'nomor_kamar' => 'A-01',
                'status_kamar' => 'terisi',
                'harga_bulanan' => 750000,
                'luas_kamar' => '3x3 m',
            ],
            [
                'nomor_kamar' => 'A-02',
                'status_kamar' => 'terisi',
                'harga_bulanan' => 750000,
                'luas_kamar' => '3x3 m',
            ],
            [
                'nomor_kamar' => 'B-01',
                'status_kamar' => 'terisi',
                'harga_bulanan' => 1000000,
                'luas_kamar' => '4x3 m',
            ],
            [
                'nomor_kamar' => 'B-02',
                'status_kamar' => 'tersedia',
                'harga_bulanan' => 1000000,
                'luas_kamar' => '4x3 m',
            ],
            [
                'nomor_kamar' => 'C-01',
                'status_kamar' => 'tersedia',
                'harga_bulanan' => 1250000,
                'luas_kamar' => '4x4 m',
            ],
            [
                'nomor_kamar' => 'C-02',
                'status_kamar' => 'perbaikan',
                'harga_bulanan' => 1250000,
                'luas_kamar' => '4x4 m',
            ],
        ];

        $kamars = collect($kamarData)->map(function (array $data) {
            return Kamar::updateOrCreate(
                ['nomor_kamar' => $data['nomor_kamar']],
                [
                    'fasilitas' => 'Kasur, Lemari, Meja, WiFi, Kamar mandi dalam',
                    'harga_bulanan' => $data['harga_bulanan'],
                    'luas_kamar' => $data['luas_kamar'],
                    'foto_kamar' => null,
                    'status_kamar' => $data['status_kamar'],
                ]
            );
        });

        $activeSewas = collect();

        foreach ($penyewaUsers->take(3)->values() as $index => $user) {
            $kamar = $kamars[$index];

            $sewa = RiwayatSewa::updateOrCreate(
                [
                    'id_user' => $user->id,
                    'id_kamar' => $kamar->id_kamar,
                    'status_sewa' => 'aktif',
                ],
                [
                    'tanggal_masuk' => $now->copy()->subMonths($index + 1)->startOfMonth()->toDateString(),
                    'tanggal_keluar' => null,
                    'harga_deal' => $kamar->harga_bulanan,
                    'durasi_sewa_bulan' => 12,
                    'status_sewa' => 'aktif',
                ]
            );

            $activeSewas->push($sewa);
        }

        $alumniUser = $penyewaUsers[3];
        $alumniKamar = $kamars[3];

        RiwayatSewa::updateOrCreate(
            [
                'id_user' => $alumniUser->id,
                'id_kamar' => $alumniKamar->id_kamar,
                'status_sewa' => 'selesai',
            ],
            [
                'tanggal_masuk' => $now->copy()->subMonths(8)->startOfMonth()->toDateString(),
                'tanggal_keluar' => $now->copy()->subMonths(2)->endOfMonth()->toDateString(),
                'harga_deal' => $alumniKamar->harga_bulanan,
                'durasi_sewa_bulan' => 6,
                'status_sewa' => 'selesai',
            ]
        );

        foreach ($activeSewas as $index => $sewa) {
            $kodeInvoice = 'IMA-INV-' . $now->format('Ym') . '-' . str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT);

            $tagihan = Tagihan::updateOrCreate(
                ['kode_invoice' => $kodeInvoice],
                [
                    'id_sewa' => $sewa->id_sewa,
                    'tanggal_tagihan' => $now->copy()->startOfMonth()->toDateString(),
                    'tanggal_jatuh_tempo' => $now->copy()->startOfMonth()->addDays(10)->toDateString(),
                    'total_tagihan' => $sewa->harga_deal,
                    'status_tagihan' => $index < 2 ? 'lunas' : 'belum_bayar',
                ]
            );

            if ($tagihan->status_tagihan === 'lunas') {
                Pembayaran::updateOrCreate(
                    ['id_tagihan' => $tagihan->id_tagihan],
                    [
                        'tanggal_bayar' => $now->copy()->day(min($index + 2, 28))->toDateString(),
                        'jumlah_bayar' => $tagihan->total_tagihan,
                        'metode_pembayaran' => 'transfer bank',
                        'bukti_bayar' => null,
                        'status_verifikasi' => 'diterima',
                        'catatan_admin' => 'Pembayaran diterima untuk data laporan keuangan.',
                    ]
                );
            }
        }

        $pengeluaranData = [
            [
                'judul_pengeluaran' => 'Pembelian token listrik',
                'deskripsi' => 'Token listrik area kamar dan fasilitas umum.',
                'jumlah_pengeluaran' => 350000,
                'tanggal_pengeluaran' => $now->copy()->day(5)->toDateString(),
            ],
            [
                'judul_pengeluaran' => 'Perbaikan kran kamar mandi',
                'deskripsi' => 'Penggantian kran dan biaya tukang.',
                'jumlah_pengeluaran' => 175000,
                'tanggal_pengeluaran' => $now->copy()->day(9)->toDateString(),
            ],
            [
                'judul_pengeluaran' => 'Pembelian alat kebersihan',
                'deskripsi' => 'Sapu, pel, cairan pembersih, dan plastik sampah.',
                'jumlah_pengeluaran' => 220000,
                'tanggal_pengeluaran' => $now->copy()->day(12)->toDateString(),
            ],
        ];

        foreach ($pengeluaranData as $data) {
            Pengeluaran::updateOrCreate(
                [
                    'judul_pengeluaran' => $data['judul_pengeluaran'],
                    'tanggal_pengeluaran' => $data['tanggal_pengeluaran'],
                ],
                [
                    'deskripsi' => $data['deskripsi'],
                    'jumlah_pengeluaran' => $data['jumlah_pengeluaran'],
                    'bukti_foto' => null,
                    'dibuat_oleh' => $admin->id,
                ]
            );
        }
    }
}
