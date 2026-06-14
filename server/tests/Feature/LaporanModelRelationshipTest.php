<?php

namespace Tests\Feature;

use App\Features\Kamar\Models\Kamar;
use App\Features\Laporan\Models\Pengeluaran;
use App\Features\Sewa\Models\RiwayatSewa;
use App\Models\Tagihan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LaporanModelRelationshipTest extends TestCase
{
    use RefreshDatabase;

    public function test_tagihan_eager_loads_feature_local_riwayat_sewa(): void
    {
        [$admin, $sewa] = $this->createRental();

        $tagihan = Tagihan::create([
            'id_sewa' => $sewa->id_sewa,
            'kode_invoice' => 'INV-RELATION-001',
            'tanggal_tagihan' => '2026-06-14',
            'tanggal_jatuh_tempo' => '2026-06-14',
            'total_tagihan' => 1000000,
            'status_tagihan' => 'lunas',
        ]);

        $loaded = Tagihan::with('riwayatSewa')
            ->findOrFail($tagihan->id_tagihan);

        $this->assertInstanceOf(
            RiwayatSewa::class,
            $loaded->riwayatSewa
        );
        $this->assertSame($sewa->id_sewa, $loaded->riwayatSewa->id_sewa);
    }

    public function test_pengeluaran_eager_loads_global_user_model(): void
    {
        [$admin] = $this->createRental();

        $pengeluaran = Pengeluaran::create([
            'judul_pengeluaran' => 'Pengeluaran pengujian relasi',
            'deskripsi' => 'Data sementara untuk regression test.',
            'jumlah_pengeluaran' => 250000,
            'tanggal_pengeluaran' => '2026-06-14',
            'bukti_foto' => null,
            'dibuat_oleh' => $admin->id,
        ]);

        $loaded = Pengeluaran::with('pencatat')
            ->findOrFail($pengeluaran->id_pengeluaran);

        $this->assertInstanceOf(User::class, $loaded->pencatat);
        $this->assertSame($admin->id, $loaded->pencatat->id);
    }

    private function createRental(): array
    {
        $admin = User::create([
            'email' => 'laporan-relation-admin@test.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'nama_lengkap' => 'Admin Relation Test',
            'no_hp' => '081234567899',
        ]);

        $penyewa = User::create([
            'email' => 'laporan-relation-tenant@test.com',
            'password' => Hash::make('password'),
            'role' => 'penyewa',
            'nama_lengkap' => 'Tenant Relation Test',
            'no_hp' => '081234567898',
        ]);

        $kamar = Kamar::create([
            'nomor_kamar' => 'REL-01',
            'fasilitas' => 'WiFi',
            'harga_bulanan' => 1000000,
            'luas_kamar' => '3x3',
            'foto_kamar' => null,
            'status_kamar' => 'terisi',
        ]);

        $sewa = RiwayatSewa::create([
            'id_user' => $penyewa->id,
            'id_kamar' => $kamar->id_kamar,
            'tanggal_masuk' => '2026-06-14',
            'tanggal_keluar' => '2026-07-14',
            'harga_deal' => 1000000,
            'durasi_sewa_bulan' => 1,
            'status_sewa' => 'aktif',
        ]);

        return [$admin, $sewa];
    }
}
