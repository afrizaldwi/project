<?php

namespace Tests\Feature;

use App\Features\BukuTamu\Models\BukuTamu;
use App\Models\Kamar;
use App\Features\Keluhan\Models\Keluhan;
use App\Features\Laporan\Models\Pengeluaran;
use App\Features\Tagihan\Models\Pembayaran;
use App\Models\RiwayatSewa;
use App\Models\Tagihan;
use App\Models\User;
use App\Features\VisitorAnalytics\Models\Visitor;
use Carbon\Carbon;
use Database\Seeders\WorkflowDemoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class IntegratedDemoSeederTest extends TestCase
{
    use RefreshDatabase;

    protected function runSeederInLocal(): void
    {
        app()->detectEnvironment(fn () => 'local');
        Storage::fake('public');
        $this->artisan('db:seed', ['--force' => true])->assertSuccessful();
    }

    public function test_production_environment_does_not_load_demo_data(): void
    {
        app()->detectEnvironment(fn () => 'production');
        $this->artisan('db:seed', ['--force' => true])->assertSuccessful();

        $this->assertEquals(0, Kamar::count());
        $this->assertEquals(0, RiwayatSewa::count());
    }

    public function test_exact_target_counts_and_distributions(): void
    {
        $preflightAdmin = User::create([
            'email' => 'admin@kost.com',
            'nama_lengkap' => 'Admin Kost',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'no_hp' => '081234567890',
            'alamat_asal' => 'Sistem',
        ]);
        Visitor::create([
            'visitor_key' => 'test-key-1',
            'visit_date' => now()->toDateString(),
        ]);

        $this->runSeederInLocal();

        $this->assertEquals(WorkflowDemoSeeder::TOTAL_KAMAR, Kamar::count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_PENYEWA, User::where('role', 'penyewa')->count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_PENYEWA, RiwayatSewa::count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_SEWA_AKTIF, RiwayatSewa::where('status_sewa', 'aktif')->count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_SEWA_SELESAI, RiwayatSewa::where('status_sewa', 'selesai')->count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_TAGIHAN, Tagihan::count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_PEMBAYARAN, Pembayaran::count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_KELUHAN, Keluhan::count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_BUKU_TAMU, BukuTamu::count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_PENGELUARAN, Pengeluaran::count());

        $this->assertEquals(WorkflowDemoSeeder::TOTAL_KELUHAN_SELESAI, Keluhan::where('status_keluhan', 'selesai')->count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_KELUHAN_PROSES, Keluhan::where('status_keluhan', 'proses')->count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_KELUHAN_PENDING, Keluhan::where('status_keluhan', 'pending')->count());

        $this->assertEquals(WorkflowDemoSeeder::TOTAL_TAGIHAN_LUNAS, Tagihan::where('status_tagihan', 'lunas')->count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_TAGIHAN_BATAL, Tagihan::where('status_tagihan', 'dibatalkan')->count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_TAGIHAN_BELUM_BAYAR, Tagihan::where('status_tagihan', 'belum_bayar')->count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_TAGIHAN_TELAT, Tagihan::where('status_tagihan', 'telat')->count());

        $this->assertEquals(WorkflowDemoSeeder::TOTAL_PEMBAYARAN_DITERIMA, Pembayaran::where('status_verifikasi', 'diterima')->count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_PEMBAYARAN_PENDING, Pembayaran::where('status_verifikasi', 'pending')->count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_PEMBAYARAN_DITOLAK, Pembayaran::where('status_verifikasi', 'ditolak')->count());

        $this->assertEquals(WorkflowDemoSeeder::TOTAL_PEMBAYARAN_TRANSFER_BANK, Pembayaran::where('metode_pembayaran', 'Transfer Bank')->count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_PEMBAYARAN_TUNAI, Pembayaran::where('metode_pembayaran', 'Tunai')->count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_PEMBAYARAN_E_WALLET, Pembayaran::where('metode_pembayaran', 'E-Wallet')->count());

        $this->assertEquals(1, User::where('role', 'admin')->count());
        $admin = User::where('role', 'admin')->first();
        $this->assertEquals($preflightAdmin->id, $admin->id);
        $this->assertEquals($preflightAdmin->password, $admin->password);

        $this->assertEquals(1, Visitor::count());
        $this->assertEquals('test-key-1', Visitor::first()->visitor_key);
    }

    public function test_room_rental_and_invoice_integrity(): void
    {
        $this->runSeederInLocal();

        $this->assertEquals(30, Kamar::where('status_kamar', 'terisi')->count());
        $this->assertEquals(10, Kamar::where('status_kamar', 'tersedia')->count());

        foreach (Kamar::where('status_kamar', 'terisi')->get() as $k) {
            $this->assertEquals(1, RiwayatSewa::where('id_kamar', $k->id_kamar)->where('status_sewa', 'aktif')->count());
        }
        foreach (Kamar::where('status_kamar', 'tersedia')->get() as $k) {
            $this->assertEquals(0, RiwayatSewa::where('id_kamar', $k->id_kamar)->where('status_sewa', 'aktif')->count());
        }

        $rooms = RiwayatSewa::orderBy('tanggal_masuk')->get()->groupBy('id_kamar');
        foreach ($rooms as $roomId => $rentals) {
            $lastKeluar = null;
            foreach ($rentals as $r) {
                if ($lastKeluar) {
                    $this->assertTrue(Carbon::parse($r->tanggal_masuk)->greaterThanOrEqualTo(Carbon::parse($lastKeluar)));
                }
                $lastKeluar = $r->tanggal_keluar;
            }
        }

        $tenants = RiwayatSewa::orderBy('tanggal_masuk')->get()->groupBy('id_user');
        foreach ($tenants as $tId => $rentals) {
            $lastKeluar = null;
            foreach ($rentals as $r) {
                if ($lastKeluar) {
                    $this->assertTrue(Carbon::parse($r->tanggal_masuk)->greaterThanOrEqualTo(Carbon::parse($lastKeluar)));
                }
                $lastKeluar = $r->tanggal_keluar;
            }
        }

        $lunasInvoices = Tagihan::where('status_tagihan', 'lunas')->get();
        foreach ($lunasInvoices as $l) {
            $payments = Pembayaran::where('id_tagihan', $l->id_tagihan)->get();
            $this->assertEquals(1, $payments->count());
            $this->assertEquals('diterima', $payments->first()->status_verifikasi);
        }

        $invalidTags = Tagihan::whereIn('status_tagihan', ['belum_bayar', 'telat', 'dibatalkan'])->pluck('id_tagihan');
        $this->assertEquals(0, Pembayaran::whereIn('id_tagihan', $invalidTags)->where('status_verifikasi', 'diterima')->count());

        $currentYearStart = Carbon::now(config('app.timezone', 'Asia/Jakarta'))->startOfYear();
        $oldUnresolved = Tagihan::whereIn('status_tagihan', ['belum_bayar', 'telat'])
            ->whereDate('tanggal_tagihan', '<', $currentYearStart->toDateString())
            ->count();
        $this->assertEquals(0, $oldUnresolved);

        $oldPendingRejected = Pembayaran::whereIn('status_verifikasi', ['pending', 'ditolak'])
            ->whereDate('tanggal_bayar', '<', $currentYearStart->toDateString())
            ->count();
        $this->assertEquals(0, $oldPendingRejected);

        $unresolvedTags = Tagihan::whereIn('status_tagihan', ['belum_bayar', 'telat'])->get();
        foreach ($unresolvedTags as $u) {
            $sewa = RiwayatSewa::find($u->id_sewa);
            $this->assertEquals('aktif', $sewa->status_sewa);
        }

        foreach (Tagihan::all() as $t) {
            $this->assertTrue(Carbon::parse($t->tanggal_jatuh_tempo)->greaterThanOrEqualTo(Carbon::parse($t->tanggal_tagihan)));
            $sewa = RiwayatSewa::find($t->id_sewa);
            $this->assertTrue(Carbon::parse($t->tanggal_tagihan)->greaterThanOrEqualTo(Carbon::parse($sewa->tanggal_masuk)));
        }
    }

    public function test_complaint_guest_expense_and_asset_integrity(): void
    {
        $this->runSeederInLocal();

        $pendingProses = Keluhan::whereIn('status_keluhan', ['pending', 'proses'])->get();
        foreach ($pendingProses as $c) {
            $this->assertNull($c->tanggal_selesai);
            $sewa = RiwayatSewa::find($c->id_sewa);
            $this->assertEquals('aktif', $sewa->status_sewa);
        }

        $bocor = Keluhan::where('judul_keluhan', 'like', '%Atap Bocor%')->get();
        foreach ($bocor as $b) {
            $this->assertStringContainsString('atap-bocor', $b->foto_kerusakan);
        }
        $ac = Keluhan::where('judul_keluhan', 'like', '%AC Rusak%')->get();
        foreach ($ac as $a) {
            $this->assertStringContainsString('ac-rusak', $a->foto_kerusakan);
        }
        $other = Keluhan::where('judul_keluhan', 'not like', '%Atap Bocor%')
            ->where('judul_keluhan', 'not like', '%AC Rusak%')->get();
        foreach ($other as $o) {
            $this->assertNull($o->foto_kerusakan);
        }

        foreach (BukuTamu::all() as $g) {
            $waktuDate = Carbon::parse($g->waktu_berkunjung)->toDateString();
            $sewa = RiwayatSewa::where('id_user', $g->bertemu_dengan)
                ->where('tanggal_masuk', '<=', $waktuDate)
                ->where(function($q) use ($waktuDate) {
                    $q->where('tanggal_keluar', '>=', $waktuDate)
                      ->orWhereNull('tanggal_keluar');
                })->first();
            $this->assertNotNull($sewa);
        }

        $expenses = Pengeluaran::all();
        $this->assertEquals(216, $expenses->count());
        $months = [];
        foreach ($expenses as $e) {
            $monthKey = Carbon::parse($e->tanggal_pengeluaran)->format('Y-m');
            $months[$monthKey] = ($months[$monthKey] ?? 0) + 1;
        }
        $this->assertCount(36, $months);
        foreach ($months as $m => $count) {
            $this->assertEquals(6, $count, "Month $m must have exactly 6 expenses");
        }

        foreach (Pembayaran::all() as $p) {
            if ($p->metode_pembayaran === 'Tunai') {
                $this->assertStringContainsString('cash.png', $p->bukti_bayar);
            } elseif ($p->metode_pembayaran === 'E-Wallet') {
                $this->assertStringContainsString('e-wallet.png', $p->bukti_bayar);
            } elseif ($p->metode_pembayaran === 'Transfer Bank') {
                $this->assertStringContainsString('transfer-bank-', $p->bukti_bayar);
            }
        }

        $paidInvoiceIds = Pembayaran::pluck('id_tagihan')->toArray();
        $unpaidInvoices = Tagihan::whereNotIn('id_tagihan', $paidInvoiceIds)->get();
        foreach ($unpaidInvoices as $u) {
            $this->assertEquals(0, Pembayaran::where('id_tagihan', $u->id_tagihan)->count());
        }
    }

    public function test_timeline_boundaries_and_month_keys(): void
    {
        $this->runSeederInLocal();
        $baseDate = Carbon::now(config('app.timezone', 'Asia/Jakarta'))->startOfDay();
        $historyStart = $baseDate->copy()->startOfMonth()->subMonths(35);

        $this->assertEquals(0, RiwayatSewa::whereDate('tanggal_masuk', '<', $historyStart->toDateString())->count());
        $this->assertEquals(0, Tagihan::whereDate('tanggal_tagihan', '<', $historyStart->toDateString())->count());
        $this->assertEquals(0, Pembayaran::whereDate('tanggal_bayar', '<', $historyStart->toDateString())->count());
        $this->assertEquals(0, Keluhan::whereDate('tanggal_lapor', '<', $historyStart->toDateString())->count());
        $this->assertEquals(0, BukuTamu::whereDate('waktu_berkunjung', '<', $historyStart->toDateString())->count());
        $this->assertEquals(0, Pengeluaran::whereDate('tanggal_pengeluaran', '<', $historyStart->toDateString())->count());

        $completedRentals = RiwayatSewa::where('status_sewa', 'selesai')->get();
        foreach ($completedRentals as $r) {
            $this->assertTrue(Carbon::parse($r->tanggal_keluar)->lessThan($baseDate));
        }
        $activeRentals = RiwayatSewa::where('status_sewa', 'aktif')->get();
        foreach ($activeRentals as $r) {
            $this->assertTrue(Carbon::parse($r->tanggal_masuk)->lessThanOrEqualTo($baseDate));
            $this->assertTrue(Carbon::parse($r->tanggal_keluar)->greaterThanOrEqualTo($baseDate));
        }

        $expenseAmounts = Pengeluaran::pluck('jumlah_pengeluaran')->unique();
        $this->assertTrue($expenseAmounts->count() > 1);

        $this->assertEquals(WorkflowDemoSeeder::TOTAL_PENYEWA, User::where('role', 'penyewa')->pluck('email')->unique()->count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_KAMAR, Kamar::pluck('nomor_kamar')->unique()->count());
        $this->assertEquals(WorkflowDemoSeeder::TOTAL_TAGIHAN, Tagihan::pluck('kode_invoice')->unique()->count());
    }

    public function test_asset_publication_and_rollback(): void
    {
        Storage::fake('public');
        $publicDisk = Storage::disk('public');

        $publicDisk->makeDirectory('demo/kamar');
        $publicDisk->put('demo/kamar/kamar-1.png', 'old_content');

        $this->assertEquals('old_content', $publicDisk->get('demo/kamar/kamar-1.png'));

        $seeder = new FailingWorkflowDemoSeeder();

        try {
            $seeder->run();
            $this->fail('Seeder should have failed.');
        } catch (\RuntimeException $e) {
            $this->assertEquals('Deliberate seeder failure', $e->getMessage());
        }

        $this->assertEquals('old_content', $publicDisk->get('demo/kamar/kamar-1.png'));
        $this->assertFalse($publicDisk->exists('demo/keluhan/atap-bocor.png'));

        $this->assertEquals(0, Kamar::count());
        $this->assertEquals(0, RiwayatSewa::count());

        $this->runSeederInLocal();
        $postSeederDisk = Storage::disk('public');
        $this->assertTrue($postSeederDisk->exists('demo/kamar/kamar-1.png'));
        $this->assertNotEquals('old_content', $postSeederDisk->get('demo/kamar/kamar-1.png'));
        $this->assertTrue($postSeederDisk->exists('demo/keluhan/atap-bocor.png'));
        $this->assertTrue($postSeederDisk->exists('demo/keluhan/ac-rusak.png'));
        $this->assertTrue($postSeederDisk->exists('demo/bukti-bayar/transfer-bank-1.png'));
        $this->assertTrue($postSeederDisk->exists('demo/bukti-bayar/transfer-bank-2.png'));
        $this->assertTrue($postSeederDisk->exists('demo/bukti-bayar/cash.png'));
        $this->assertTrue($postSeederDisk->exists('demo/bukti-bayar/e-wallet.png'));
    }

    public function test_strengthened_chronology_rules(): void
    {
        $this->runSeederInLocal();
        $baseDate = Carbon::now(config('app.timezone', 'Asia/Jakarta'))->startOfDay();
        $historyStart = $baseDate->copy()->startOfMonth()->subMonths(35);

        foreach (Tagihan::all() as $t) {
            $sewa = RiwayatSewa::find($t->id_sewa);
            $this->assertTrue(Carbon::parse($t->tanggal_tagihan)->lessThanOrEqualTo(Carbon::parse($sewa->tanggal_keluar)), "Invoice date after rental end");
            $this->assertTrue(Carbon::parse($t->tanggal_jatuh_tempo)->lessThanOrEqualTo(Carbon::parse($sewa->tanggal_keluar)), "Due date after rental end");
            $this->assertTrue(Carbon::parse($t->tanggal_tagihan)->lessThanOrEqualTo(Carbon::parse($t->tanggal_jatuh_tempo)), "Invoice date after due date");
            $this->assertTrue(Carbon::parse($t->tanggal_tagihan)->lessThanOrEqualTo($baseDate), "Invoice date after baseDate");
        }

        foreach (Pembayaran::all() as $p) {
            $t = Tagihan::find($p->id_tagihan);
            $this->assertTrue(Carbon::parse($p->tanggal_bayar)->greaterThanOrEqualTo(Carbon::parse($t->tanggal_tagihan)), "Payment date before invoice date");
            $this->assertTrue(Carbon::parse($p->tanggal_bayar)->lessThanOrEqualTo($baseDate), "Payment date after baseDate");

            if ($p->status_verifikasi === 'diterima') {
                $this->assertEquals($t->total_tagihan, $p->jumlah_bayar, "Accepted payment amount mismatch");
                $this->assertEquals('lunas', $t->status_tagihan);
            } elseif ($p->status_verifikasi === 'pending') {
                $diffDays = Carbon::parse($p->tanggal_bayar)->diffInDays($baseDate);
                $this->assertTrue($diffDays <= 7, "Pending payment date not within 7 days");
                $this->assertEquals('belum_bayar', $t->status_tagihan);
            } elseif ($p->status_verifikasi === 'ditolak') {
                $diffDays = Carbon::parse($p->tanggal_bayar)->diffInDays($baseDate);
                $this->assertTrue($diffDays <= 30, "Rejected payment date not within 30 days");
                $this->assertTrue(in_array($t->status_tagihan, ['belum_bayar', 'telat'], true));
            }
        }

        $cancelledInvoices = Tagihan::where('status_tagihan', 'dibatalkan')->get();
        foreach ($cancelledInvoices as $c) {
            $this->assertEquals(0, Pembayaran::where('id_tagihan', $c->id_tagihan)->count(), "Cancelled invoice has payment rows");
        }

        $belumBayarInvs = Tagihan::where('status_tagihan', 'belum_bayar')->get();
        $currentYearStart = $baseDate->copy()->startOfYear();
        foreach ($belumBayarInvs as $b) {
            $tTagihan = Carbon::parse($b->tanggal_tagihan);
            $tJatuhTempo = Carbon::parse($b->tanggal_jatuh_tempo);
            $this->assertTrue($tTagihan->lessThanOrEqualTo($baseDate));
            $this->assertTrue($tTagihan->greaterThanOrEqualTo($currentYearStart));
            $this->assertTrue($tJatuhTempo->greaterThanOrEqualTo($baseDate));
            $this->assertTrue($tJatuhTempo->lessThanOrEqualTo($baseDate->copy()->addDays(30)));
        }

        $telatInvs = Tagihan::where('status_tagihan', 'telat')->get();
        foreach ($telatInvs as $tel) {
            $tTagihan = Carbon::parse($tel->tanggal_tagihan);
            $tJatuhTempo = Carbon::parse($tel->tanggal_jatuh_tempo);
            $this->assertTrue($tTagihan->lessThanOrEqualTo($baseDate));
            $this->assertTrue($tJatuhTempo->greaterThanOrEqualTo($baseDate->copy()->subDays(30)));
            $this->assertTrue($tJatuhTempo->lessThanOrEqualTo($baseDate->copy()->subDays(1)));
        }

        $expectedMonths = [];
        $curr = $historyStart->copy()->startOfMonth();
        $limit = $baseDate->copy()->startOfMonth();
        while ($curr->lessThanOrEqualTo($limit)) {
            $expectedMonths[] = $curr->format('Y-m');
            $curr->addMonth();
        }

        $invMonths = Tagihan::all()->map(fn($t) => Carbon::parse($t->tanggal_tagihan)->format('Y-m'))->unique()->values()->all();
        sort($invMonths);
        $this->assertEquals($expectedMonths, $invMonths);

        $payMonths = Pembayaran::where('status_verifikasi', 'diterima')->get()
            ->map(fn($p) => Carbon::parse($p->tanggal_bayar)->format('Y-m'))->unique()->values()->all();
        sort($payMonths);
        $this->assertEquals($expectedMonths, $payMonths);

        $guestMonths = BukuTamu::all()->map(fn($g) => Carbon::parse($g->waktu_berkunjung)->format('Y-m'))->unique()->values()->all();
        sort($guestMonths);
        $this->assertEquals($expectedMonths, $guestMonths);

        $expenseMonths = Pengeluaran::all()->map(fn($e) => Carbon::parse($e->tanggal_pengeluaran)->format('Y-m'))->unique()->values()->all();
        sort($expenseMonths);
        $this->assertEquals($expectedMonths, $expenseMonths);

        // Complaint chronology rules
        foreach (Keluhan::all() as $c) {
            $sewa = RiwayatSewa::find($c->id_sewa);
            $tLapor = Carbon::parse($c->tanggal_lapor);
            $tSelesai = $c->tanggal_selesai ? Carbon::parse($c->tanggal_selesai) : null;
            $masuk = Carbon::parse($sewa->tanggal_masuk);
            $keluar = Carbon::parse($sewa->tanggal_keluar);

            $this->assertTrue($tLapor->greaterThanOrEqualTo($masuk), "Report date before rental start");
            $this->assertTrue($tLapor->lessThanOrEqualTo($keluar), "Report date after rental end");
            $this->assertTrue($tLapor->lessThanOrEqualTo($baseDate), "Report date after baseDate");

            if ($c->status_keluhan === 'selesai') {
                $this->assertNotNull($tSelesai, "Completed complaint has null resolution date");
                $this->assertTrue($tSelesai->greaterThanOrEqualTo($tLapor), "Resolution date before report date");
                $this->assertTrue($tSelesai->lessThanOrEqualTo($keluar), "Resolution date after rental end");
                $this->assertTrue($tSelesai->lessThanOrEqualTo($baseDate), "Resolution date after baseDate");
            } else {
                $this->assertNull($tSelesai, "Unfinished complaint has non-null resolution date");
                $this->assertEquals('aktif', $sewa->status_sewa, "Historical complaint is not completed");

                if ($c->status_keluhan === 'proses') {
                    $diffDays = $tLapor->diffInDays($baseDate);
                    $this->assertTrue($diffDays <= 60, "Process complaint not within 60 days");
                } elseif ($c->status_keluhan === 'pending') {
                    $diffDays = $tLapor->diffInDays($baseDate);
                    $this->assertTrue($diffDays <= 30, "Pending complaint not within 30 days");
                }
            }
        }

        // Expense variation assertions
        $categories = ['Listrik', 'Air', 'Internet', 'Kebersihan', 'Keamanan', 'Perawatan/Perbaikan'];
        $ranges = [
            'Listrik' => [2000000, 4000000],
            'Air' => [800000, 1500000],
            'Internet' => [500000, 1000000],
            'Kebersihan' => [1000000, 2000000],
            'Keamanan' => [1500000, 2500000],
            'Perawatan/Perbaikan' => [500000, 3000000],
        ];

        $expensesGrouped = Pengeluaran::all()->groupBy('judul_pengeluaran');
        $monthlyTotals = [];

        foreach ($categories as $cat) {
            $catExpenses = $expensesGrouped->get("Biaya " . $cat);
            $this->assertNotNull($catExpenses, "Category Biaya {$cat} has no expenses");

            $amounts = $catExpenses->pluck('jumlah_pengeluaran')->unique();
            $this->assertTrue($amounts->count() > 5, "Category Biaya {$cat} does not have more than 5 distinct values (has {$amounts->count()})");

            $minVal = $ranges[$cat][0];
            $maxVal = $ranges[$cat][1];

            foreach ($catExpenses as $e) {
                $amount = $e->jumlah_pengeluaran;
                $this->assertTrue($amount >= $minVal && $amount <= $maxVal, "Expense {$e->judul_pengeluaran} amount {$amount} is outside range [{$minVal}, {$maxVal}]");

                $this->assertNotEquals('Pengeluaran rutin', $e->deskripsi, "Expense description is generic");

                $monthKey = Carbon::parse($e->tanggal_pengeluaran)->format('Y-m');
                $monthlyTotals[$monthKey] = ($monthlyTotals[$monthKey] ?? 0) + $amount;
            }
        }

        $uniqueMonthlyTotals = array_unique($monthlyTotals);
        $this->assertTrue(count($uniqueMonthlyTotals) > 1, "Monthly total expenses are identical across all months");
    }

    public function test_partial_publication_rollback(): void
    {
        Storage::fake('public');
        $publicDisk = Storage::disk('public');

        $publicDisk->makeDirectory('demo/kamar');
        $publicDisk->put('demo/kamar/kamar-1.png', 'original_content');

        $seeder = new FailingPublisherWorkflowDemoSeeder();

        try {
            $seeder->run();
            $this->fail('Seeder should have failed.');
        } catch (\RuntimeException $e) {
            $this->assertEquals('Deliberate publication failure', $e->getMessage());
        }

        $this->assertEquals('original_content', $publicDisk->get('demo/kamar/kamar-1.png'));
        $this->assertFalse($publicDisk->exists('demo/keluhan/atap-bocor.png'));

        $this->assertEquals(0, Kamar::count());
        $this->assertEquals(0, RiwayatSewa::count());
    }
}

class FailingWorkflowDemoSeeder extends WorkflowDemoSeeder
{
    protected function runAssertions(): void
    {
        parent::runAssertions();
        throw new \RuntimeException('Deliberate seeder failure');
    }
}

class FailingPublisherWorkflowDemoSeeder extends WorkflowDemoSeeder
{
    protected function validateAndPublishAssets(): void
    {
        $assetsDir = base_path('database/seeders/assets');
        $publicDisk = Storage::disk('public');

        $key = 'kamar';
        $relPath = 'kamar/1.png';
        $sourcePath = $assetsDir . '/' . $relPath;
        $destPath = 'demo/kamar/kamar-1.png';

        $publicDisk->makeDirectory('demo/kamar');
        if ($publicDisk->exists($destPath)) {
            $this->overwrittenFiles[$destPath] = $publicDisk->get($destPath);
        } else {
            $this->newlyCreatedFiles[] = $destPath;
        }
        $publicDisk->put($destPath, File::get($sourcePath));
        $this->publishedPaths[$key] = $destPath;

        throw new \RuntimeException('Deliberate publication failure');
    }
}
