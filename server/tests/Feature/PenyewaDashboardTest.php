<?php

namespace Tests\Feature;

use App\Features\Dashboard\Services\PenyewaDashboardService;
use App\Features\Kamar\Models\Kamar;
use App\Features\Sewa\Models\RiwayatSewa;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PenyewaDashboardTest extends TestCase
{
    use RefreshDatabase;

    private User $penyewa;

    protected function setUp(): void
    {
        parent::setUp();

        $this->penyewa = User::create([
            'email' => 'tenant@test.com',
            'password' => Hash::make('password'),
            'role' => 'penyewa',
            'nama_lengkap' => 'Test Tenant',
            'no_hp' => '081234567890',
        ]);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function test_active_rental_at_beginning_uses_same_boundary_for_cards_and_contract(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-06-14 10:00:00', config('app.timezone')));

        $this->createActiveSewa('2026-06-14', 2);

        $response = $this->actingAs($this->penyewa, 'api')->getJson('/api/penyewa/dashboard-summary');

        $response->assertOk();
        $response->assertJson([
            'cards' => [
                'sisa_masa_sewa' => '2 bulan',
            ],
            'kontrak' => [
                'tanggal_masuk' => '2026-06-14',
                'tanggal_keluar' => '2026-08-14',
                'progress_persen' => 1,
                'sisa_masa_sewa' => '2 bulan',
            ],
        ]);

        $this->assertSame(
            $response->json('cards.sisa_masa_sewa'),
            $response->json('kontrak.sisa_masa_sewa')
        );
    }

    public function test_active_rental_during_period_reuses_contract_metrics(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-07-14 10:00:00', config('app.timezone')));

        $this->createActiveSewa('2026-06-14', 2);

        $response = $this->actingAs($this->penyewa, 'api')->getJson('/api/penyewa/dashboard-summary');

        $response->assertOk();
        $response->assertJson([
            'cards' => [
                'sisa_masa_sewa' => '1 bulan',
            ],
            'kontrak' => [
                'tanggal_masuk' => '2026-06-14',
                'tanggal_keluar' => '2026-08-14',
                'progress_persen' => 50,
                'sisa_masa_sewa' => '1 bulan',
            ],
        ]);

        $this->assertSame(
            $response->json('cards.sisa_masa_sewa'),
            $response->json('kontrak.sisa_masa_sewa')
        );
    }

    public function test_active_rental_at_end_boundary_reports_finished(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-08-14 10:00:00', config('app.timezone')));

        $this->createActiveSewa('2026-06-14', 2);

        $response = $this->actingAs($this->penyewa, 'api')->getJson('/api/penyewa/dashboard-summary');

        $response->assertOk();
        $response->assertJson([
            'cards' => [
                'sisa_masa_sewa' => 'Selesai',
            ],
            'kontrak' => [
                'tanggal_masuk' => '2026-06-14',
                'tanggal_keluar' => '2026-08-14',
                'progress_persen' => 100,
                'sisa_masa_sewa' => 'Selesai',
            ],
        ]);

        $this->assertSame(
            $response->json('cards.sisa_masa_sewa'),
            $response->json('kontrak.sisa_masa_sewa')
        );
    }

    public function test_dashboard_route_rejects_penyewa_without_active_rental(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-06-14 10:00:00', config('app.timezone')));

        $response = $this->actingAs($this->penyewa, 'api')->getJson('/api/penyewa/dashboard-summary');

        $response->assertStatus(403);
        $response->assertExactJson([
            'message' => 'Akun penyewa sudah tidak aktif.',
        ]);
    }

    public function test_service_returns_empty_state_without_active_rental(): void
    {
        Carbon::setTestNow(
            Carbon::parse('2026-06-14 10:00:00', config('app.timezone'))
        );

        $service = app(PenyewaDashboardService::class);

        $summary = $service->getSummary($this->penyewa->id);

        $this->assertSame([
            'cards' => [
                'kamar_saya' => '-',
                'tagihan_aktif' => 0,
                'status_pembayaran' => '-',
                'sisa_masa_sewa' => '-',
                'keluhan_saya' => 0,
            ],
            'kamar' => null,
            'tagihan_terbaru' => null,
            'kontrak' => null,
            'keluhan_terakhir' => [],
        ], $summary);
    }

    public function test_stored_tanggal_keluar_is_preserved_in_response(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-07-14 10:00:00', config('app.timezone')));

        $this->createActiveSewa('2026-06-14', 2, '2026-09-01');

        $response = $this->actingAs($this->penyewa, 'api')->getJson('/api/penyewa/dashboard-summary');

        $response->assertOk();
        $response->assertJson([
            'kontrak' => [
                'tanggal_masuk' => '2026-06-14',
                'tanggal_keluar' => '2026-09-01',
            ],
        ]);

        $this->assertSame('2026-09-01', $response->json('kontrak.tanggal_keluar'));
        $this->assertNotSame(
            Carbon::parse('2026-06-14')->addMonths(2)->toDateString(),
            $response->json('kontrak.tanggal_keluar')
        );
    }

    private function createActiveSewa(string $tanggalMasuk, int $durasiBulan, ?string $tanggalKeluar = null): RiwayatSewa
    {
        $kamar = Kamar::create([
            'nomor_kamar' => 'A-101',
            'fasilitas' => 'AC, Kamar mandi dalam',
            'harga_bulanan' => 1500000,
            'luas_kamar' => '3x4',
            'foto_kamar' => null,
            'status_kamar' => 'terisi',
        ]);

        return RiwayatSewa::create([
            'id_user' => $this->penyewa->id,
            'id_kamar' => $kamar->id_kamar,
            'tanggal_masuk' => $tanggalMasuk,
            'tanggal_keluar' => $tanggalKeluar ?? Carbon::parse($tanggalMasuk)->addMonths($durasiBulan)->toDateString(),
            'harga_deal' => 1500000,
            'durasi_sewa_bulan' => $durasiBulan,
            'status_sewa' => 'aktif',
        ]);
    }
}
