<?php

namespace Tests\Feature;

use App\Models\BukuTamu;
use App\Models\Kamar;
use App\Models\Keluhan;
use App\Models\Pembayaran;
use App\Models\Pengeluaran;
use App\Models\RiwayatSewa;
use App\Models\Tagihan;
use App\Models\User;
use App\Features\VisitorAnalytics\Models\Visitor;
use App\Features\Auth\Services\AuthService;
use Carbon\Carbon;
use Database\Seeders\WorkflowDemoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class IntegratedDemoSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_production_environment_does_not_load_demo_data(): void
    {
        // Mock the environment to production
        app()->detectEnvironment(fn () => 'production');

        $this->artisan('db:seed', ['--force' => true])->assertSuccessful();

        $this->assertEquals(0, Kamar::count());
        $this->assertEquals(0, RiwayatSewa::count());
        $this->assertEquals(1, User::where('role', 'admin')->count()); // Only admin
        $this->assertEquals(0, User::where('role', 'penyewa')->count());
    }

    public function test_filesystem_asset_management(): void
    {
        // 1. Create a temporary source structure
        $assetsDir = base_path('database/seeders/assets');
        if (! File::exists($assetsDir.'/kamar')) {
            File::makeDirectory($assetsDir.'/kamar', 0755, true);
        }

        // Supported extensions (case insensitive) and unsupported
        File::put($assetsDir.'/kamar/1.JpEg', 'image-content-jpeg');
        File::put($assetsDir.'/kamar/2.PNG', 'image-content-png');
        File::put($assetsDir.'/kamar/3.txt', 'unsupported');
        File::put($assetsDir.'/kamar/4.WEBP', 'image-content-webp');

        // Mock pre-existing file in public disk that will be overwritten
        Storage::disk('public')->makeDirectory('demo/kamar');
        Storage::disk('public')->put('demo/kamar/kamar-1.jpeg', 'old-content');

        // Let's run the seeder but make it fail during DB transaction to trigger rollback
        // We can do this by creating pre-existing data that preflight catches, or mock DB.
        // Wait, preflight runs BEFORE publishing. So we need to fail inside DB transaction.
        // We'll create a kamars record after preflight manually, or we just throw an exception manually?
        // Let's just create a dummy seeder subclass here.

        $seeder = new class extends WorkflowDemoSeeder
        {
            public function run(): void
            {
                $this->preflightValidation(); // Will pass if clean
                $this->discoverSourceAssets();
                $this->validateSourceAssets();
                $this->publishSelectedAssets();

                try {
                    DB::transaction(function () {
                        throw new \Exception('Triggering rollback');
                    });
                } catch (\Exception $e) {
                    $this->rollbackAssets();
                    throw $e;
                }
            }

            // Expose discovered assets for testing
            public function getSourceAssets()
            {
                return $this->sourceAssets;
            }
        };

        // Assert rollback happens
        try {
            $seeder->run();
            $this->fail('Expected exception was not thrown.');
        } catch (\Exception $e) {
            $this->assertEquals('Triggering rollback', $e->getMessage());
        }

        // 1. Check unsupported extensions were filtered
        $discovered = $seeder->getSourceAssets();
        $this->assertGreaterThanOrEqual(3, count($discovered['kamar']));
        
        $filesStr = implode('|', $discovered['kamar']);
        $this->assertStringContainsString('1.JpEg', $filesStr);
        $this->assertStringContainsString('2.PNG', $filesStr);
        $this->assertStringContainsString('4.WEBP', $filesStr);
        $this->assertStringNotContainsString('3.txt', $filesStr);

        // 2. Check restoration of overwritten files
        $this->assertTrue(Storage::disk('public')->exists('demo/kamar/kamar-1.jpeg'));
        $this->assertEquals('old-content', Storage::disk('public')->get('demo/kamar/kamar-1.jpeg'));

        // Cleanup temp files
        File::deleteDirectory($assetsDir.'/kamar');
        Storage::disk('public')->deleteDirectory('demo');
    }

    public function test_local_environment_loads_demo_data_and_maintains_invariants(): void
    {
        // Seed some preflight data
        $preflightAdmin = User::create([
            'email' => 'admin@kost.com',
            'nama_lengkap' => 'Admin Kost',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'no_hp' => '081234567890',
            'alamat_asal' => 'Sistem',
        ]);
        $preflightVisitor = Visitor::create([
            'visitor_key' => 'dummy_key_123',
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Test',
            'url' => '/',
            'visited_at' => now(),
            'visit_date' => now()->toDateString(),
        ]);

        app()->detectEnvironment(fn () => 'local');
        $this->artisan('db:seed', ['--force' => true])->assertSuccessful();

        // Admin & Visitor preservation
        $this->assertEquals(1, User::where('role', 'admin')->count());
        $admin = User::where('role', 'admin')->first();
        $this->assertEquals($preflightAdmin->id, $admin->id);
        $this->assertEquals($preflightAdmin->password, $admin->password);
        $this->assertEquals(1, Visitor::count());

        // Basic counts
        $this->assertEquals(40, Kamar::count());
        $this->assertEquals(100, User::where('role', 'penyewa')->count());
        $this->assertEquals(100, RiwayatSewa::count());

        $this->assertEquals(30, Kamar::where('status_kamar', 'terisi')->count());
        $this->assertEquals(10, Kamar::where('status_kamar', 'tersedia')->count());

        $this->assertEquals(30, RiwayatSewa::where('status_sewa', 'aktif')->count());
        $this->assertEquals(70, RiwayatSewa::where('status_sewa', 'selesai')->count());

        // Active/available rules
        foreach (Kamar::where('status_kamar', 'terisi')->get() as $k) {
            $this->assertEquals(1, RiwayatSewa::where('id_kamar', $k->id_kamar)->where('status_sewa', 'aktif')->count());
        }
        foreach (Kamar::where('status_kamar', 'tersedia')->get() as $k) {
            $this->assertEquals(0, RiwayatSewa::where('id_kamar', $k->id_kamar)->where('status_sewa', 'aktif')->count());
        }

        // Initial invoices
        $initialInvoices = Tagihan::where('kode_invoice', 'like', 'INV-INITIAL-%')->get();
        $this->assertEquals(100, $initialInvoices->count());

        foreach ($initialInvoices as $inv) {
            $payments = Pembayaran::where('id_tagihan', $inv->id_tagihan)->where('status_verifikasi', 'diterima')->get();
            $this->assertEquals(1, $payments->count());
            $this->assertEquals((float) $payments->first()->jumlah_bayar, (float) $inv->total_tagihan);
        }

        // Exact extension invoice/payment status counts
        $extensions = Tagihan::where('kode_invoice', 'like', 'INV-EXT-%')->get();
        $this->assertEquals(20, $extensions->count());

        $this->assertEquals(4, $extensions->where('status_tagihan', 'lunas')->count()); // 4 accepted
        // 4 pending, 4 rejected, 4 unpaid not due -> all belum_bayar
        $this->assertEquals(12, $extensions->where('status_tagihan', 'belum_bayar')->count());
        $this->assertEquals(4, $extensions->where('status_tagihan', 'telat')->count()); // 4 overdue

        $this->assertEquals(112, Pembayaran::count());
        $this->assertEquals(104, Pembayaran::where('status_verifikasi', 'diterima')->count()); // 100 initial + 4 ext
        $this->assertEquals(4, Pembayaran::where('status_verifikasi', 'pending')->count());
        $this->assertEquals(4, Pembayaran::where('status_verifikasi', 'ditolak')->count());

        // Complaint distribution
        $this->assertEquals(80, Keluhan::count());
        $this->assertEquals(20, Keluhan::where('status_keluhan', 'pending')->count());
        $this->assertEquals(20, Keluhan::where('status_keluhan', 'proses')->count());
        $this->assertEquals(40, Keluhan::where('status_keluhan', 'selesai')->count());
        $this->assertEquals(56, Keluhan::whereNotNull('foto_kerusakan')->count());
        $this->assertEquals(24, Keluhan::whereNull('foto_kerusakan')->count());

        // Exact 150 guests, 72 expenses
        $this->assertEquals(150, BukuTamu::count());
        $this->assertEquals(72, Pengeluaran::count());

        // Expense dates (6 per month for 0 to 11 months ago)
        $expenses = Pengeluaran::all();
        $monthCounts = [];
        $baseDate = Carbon::now(config('app.timezone', 'Asia/Jakarta'))->startOfDay();
        foreach ($expenses as $exp) {
            $date = Carbon::parse($exp->tanggal_pengeluaran);
            $diff = $date->diffInMonths($baseDate);
            $monthCounts[$diff] = ($monthCounts[$diff] ?? 0) + 1;
        }
        for ($m = 0; $m <= 11; $m++) {
            $this->assertEquals(6, $monthCounts[$m] ?? 0, "Expected 6 expenses for month -$m");
        }

        // Uniqueness
        $this->assertEquals(100, User::where('role', 'penyewa')->distinct('email')->count());
        $this->assertEquals(40, Kamar::distinct('nomor_kamar')->count());
        $this->assertEquals(120, Tagihan::distinct('kode_invoice')->count());

        // Non-overlapping intervals
        $rooms = RiwayatSewa::select('id_kamar', 'tanggal_masuk', 'tanggal_keluar')
            ->orderBy('id_kamar')
            ->orderBy('tanggal_masuk')
            ->get()
            ->groupBy('id_kamar');

        foreach ($rooms as $roomId => $rentals) {
            $lastKeluar = null;
            foreach ($rentals as $r) {
                if ($lastKeluar) {
                    $this->assertTrue(
                        Carbon::parse($r->tanggal_masuk)->greaterThanOrEqualTo(Carbon::parse($lastKeluar)),
                        "Overlap detected in room $roomId"
                    );
                }
                $lastKeluar = $r->tanggal_keluar;
            }
        }

        // Auth Eligibility
        $authService = new AuthService;
        $reqActive = new Request(['email' => 'penyewa001@kost.com', 'password' => 'password123']);
        $resActive = $authService->login($reqActive);
        $this->assertTrue($resActive['success'], 'Active tenant rejected.');

        $reqCompleted = new Request(['email' => 'penyewa031@kost.com', 'password' => 'password123']);
        $resCompleted = $authService->login($reqCompleted);
        $this->assertFalse($resCompleted['success']);
        $this->assertEquals('Akun penyewa sudah tidak aktif.', $resCompleted['message']);
    }
}
