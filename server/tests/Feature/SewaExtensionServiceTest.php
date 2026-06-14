<?php

namespace Tests\Feature;

use App\Features\Kamar\Models\Kamar;
use App\Features\Sewa\Models\RiwayatSewa;
use App\Features\Sewa\Services\SewaExtensionService;
use App\Models\Tagihan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use RuntimeException;
use Tests\TestCase;

class SewaExtensionServiceTest extends TestCase
{
    use RefreshDatabase;

    private User $penyewa;

    private Kamar $kamar;

    private SewaExtensionService $service;

    protected function setUp(): void
    {
        parent::setUp();

        Carbon::setTestNow(
            Carbon::parse('2026-06-14 10:00:00', config('app.timezone'))
        );

        $this->penyewa = User::create([
            'email' => 'extension-tenant@test.com',
            'password' => Hash::make('password'),
            'role' => 'penyewa',
            'nama_lengkap' => 'Extension Tenant',
            'no_hp' => '081234567891',
        ]);

        $this->kamar = Kamar::create([
            'nomor_kamar' => 'EXT-01',
            'fasilitas' => 'AC, kamar mandi dalam',
            'harga_bulanan' => 1500000,
            'luas_kamar' => '3x4',
            'foto_kamar' => null,
            'status_kamar' => 'terisi',
        ]);

        $this->service = app(SewaExtensionService::class);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function test_arbitrary_client_price_cannot_control_one_month_extension(): void
    {
        $sewa = $this->createSewa(
            tanggalKeluar: '2026-08-14',
            durationMonths: 2,
            accumulatedPrice: 3000000
        );

        $this->service->perpanjang($sewa->id_sewa, [
            'tanggal_mulai' => '2026-08-14',
            'durasi_sewa_bulan' => 1,
            'harga_deal' => 1,
        ]);

        $sewa->refresh();

        $this->assertSame(3, (int) $sewa->durasi_sewa_bulan);
        $this->assertSame('2026-09-14', $sewa->tanggal_keluar);
        $this->assertEquals(4500000, (float) $sewa->harga_deal);

        $this->assertSame(
            1,
            Tagihan::where('id_sewa', $sewa->id_sewa)->count()
        );

        $tagihan = Tagihan::where('id_sewa', $sewa->id_sewa)->firstOrFail();

        $this->assertEquals(1500000, (float) $tagihan->total_tagihan);
        $this->assertNotEquals(1, (float) $tagihan->total_tagihan);
        $this->assertSame('belum_bayar', $tagihan->status_tagihan);
        $this->assertSame('2026-08-14', $tagihan->tanggal_jatuh_tempo);
    }

    public function test_multiple_month_extension_uses_monthly_room_price(): void
    {
        $sewa = $this->createSewa(
            tanggalKeluar: '2026-07-14',
            durationMonths: 1,
            accumulatedPrice: 1500000
        );

        $this->service->perpanjang($sewa->id_sewa, [
            'tanggal_mulai' => '2026-07-14',
            'durasi_sewa_bulan' => 3,
        ]);

        $sewa->refresh();
        $tagihan = Tagihan::where('id_sewa', $sewa->id_sewa)->firstOrFail();

        $this->assertSame(4, (int) $sewa->durasi_sewa_bulan);
        $this->assertSame('2026-10-14', $sewa->tanggal_keluar);
        $this->assertEquals(6000000, (float) $sewa->harga_deal);
        $this->assertEquals(4500000, (float) $tagihan->total_tagihan);
    }

    public function test_inactive_rental_behavior_remains_unchanged(): void
    {
        $sewa = $this->createSewa(
            tanggalKeluar: '2026-08-14',
            durationMonths: 2,
            accumulatedPrice: 3000000,
            status: 'selesai'
        );

        try {
            $this->service->perpanjang($sewa->id_sewa, [
                'tanggal_mulai' => '2026-08-14',
                'durasi_sewa_bulan' => 1,
                'harga_deal' => 1,
            ]);

            $this->fail('Inactive rental extension should have failed.');
        } catch (RuntimeException $exception) {
            $this->assertSame(
                'Sewa tidak dapat diperpanjang karena statusnya tidak aktif.',
                $exception->getMessage()
            );
        }

        $sewa->refresh();

        $this->assertSame(2, (int) $sewa->durasi_sewa_bulan);
        $this->assertSame('2026-08-14', $sewa->tanggal_keluar);
        $this->assertEquals(3000000, (float) $sewa->harga_deal);
        $this->assertSame(
            0,
            Tagihan::where('id_sewa', $sewa->id_sewa)->count()
        );
    }

    public function test_invalid_extension_start_date_behavior_remains_unchanged(): void
    {
        $sewa = $this->createSewa(
            tanggalKeluar: '2026-08-14',
            durationMonths: 2,
            accumulatedPrice: 3000000
        );

        try {
            $this->service->perpanjang($sewa->id_sewa, [
                'tanggal_mulai' => '2026-08-15',
                'durasi_sewa_bulan' => 1,
                'harga_deal' => 1,
            ]);

            $this->fail('Invalid extension start date should have failed.');
        } catch (RuntimeException $exception) {
            $this->assertSame(
                'Tanggal mulai perpanjangan harus sama dengan tanggal keluar sewa saat ini.',
                $exception->getMessage()
            );
        }

        $sewa->refresh();

        $this->assertSame(2, (int) $sewa->durasi_sewa_bulan);
        $this->assertSame('2026-08-14', $sewa->tanggal_keluar);
        $this->assertEquals(3000000, (float) $sewa->harga_deal);
        $this->assertSame(
            0,
            Tagihan::where('id_sewa', $sewa->id_sewa)->count()
        );
    }

    private function createSewa(
        string $tanggalKeluar,
        int $durationMonths,
        float $accumulatedPrice,
        string $status = 'aktif'
    ): RiwayatSewa {
        return RiwayatSewa::create([
            'id_user' => $this->penyewa->id,
            'id_kamar' => $this->kamar->id_kamar,
            'tanggal_masuk' => '2026-06-14',
            'tanggal_keluar' => $tanggalKeluar,
            'harga_deal' => $accumulatedPrice,
            'durasi_sewa_bulan' => $durationMonths,
            'status_sewa' => $status,
        ]);
    }
}
