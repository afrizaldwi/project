<?php

namespace Database\Seeders;

use App\Features\BukuTamu\Models\BukuTamu;
use App\Features\Kamar\Models\Kamar;
use App\Features\Keluhan\Models\Keluhan;
use App\Features\Laporan\Models\Pengeluaran;
use App\Features\Notifications\Models\Notifikasi;
use App\Features\Tagihan\Models\Pembayaran;
use App\Features\Sewa\Models\RiwayatSewa;
use App\Models\Tagihan;
use App\Models\User;
use App\Features\VisitorAnalytics\Models\Visitor;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class WorkflowDemoSeeder extends Seeder
{
    public const TOTAL_KAMAR = 40;
    public const TOTAL_PENYEWA = 220;
    public const TOTAL_SEWA_AKTIF = 30;
    public const TOTAL_SEWA_SELESAI = 190;
    public const TOTAL_TAGIHAN = 1000;
    public const TOTAL_TAGIHAN_LUNAS = 780;
    public const TOTAL_TAGIHAN_BATAL = 140;
    public const TOTAL_TAGIHAN_BELUM_BAYAR = 55;
    public const TOTAL_TAGIHAN_TELAT = 25;
    public const TOTAL_PEMBAYARAN = 810;
    public const TOTAL_PEMBAYARAN_DITERIMA = 780;
    public const TOTAL_PEMBAYARAN_PENDING = 15;
    public const TOTAL_PEMBAYARAN_DITOLAK = 15;
    public const TOTAL_PEMBAYARAN_TRANSFER_BANK = 445;
    public const TOTAL_PEMBAYARAN_TUNAI = 162;
    public const TOTAL_PEMBAYARAN_E_WALLET = 203;
    public const TOTAL_KELUHAN_PROSES = 35;
    public const TOTAL_KELUHAN_PENDING = 25;
    public const TOTAL_KELUHAN_SELESAI = 190;
    public const TOTAL_KELUHAN = 250;
    public const TOTAL_BUKU_TAMU = 750;
    public const TOTAL_PENGELUARAN = 216;

    protected Carbon $baseDate;
    protected Carbon $historyStart;

    protected array $publishedPaths = [];
    protected array $overwrittenFiles = [];
    protected array $newlyCreatedFiles = [];
    protected int $adminCountPreflight = 0;
    protected int $visitorCountPreflight = 0;
    protected array $preflightAdminIds = [];
    protected array $preflightAdminHashes = [];

    private const ASSET_FILES = [
        'kamar' => 'kamar/1.png',
        'keluhan_atap_bocor' => 'keluhan/1.png',
        'keluhan_ac_rusak' => 'keluhan/2.png',
        'transfer_bank_1' => 'tagihan/1.png',
        'transfer_bank_2' => 'tagihan/2.png',
        'cash' => 'tagihan/3.png',
        'e_wallet' => 'tagihan/4.png',
    ];

    private const PUBLISHED_ASSETS = [
        'kamar' => 'demo/kamar/kamar-1.png',
        'keluhan_atap_bocor' => 'demo/keluhan/atap-bocor.png',
        'keluhan_ac_rusak' => 'demo/keluhan/ac-rusak.png',
        'transfer_bank_1' => 'demo/bukti-bayar/transfer-bank-1.png',
        'transfer_bank_2' => 'demo/bukti-bayar/transfer-bank-2.png',
        'cash' => 'demo/bukti-bayar/cash.png',
        'e_wallet' => 'demo/bukti-bayar/e-wallet.png',
    ];

    private const COMPLAINT_MAP = [
        'Atap Bocor' => [
            'title' => 'Keluhan Atap Bocor',
            'desc' => 'Air merembes dari plafon ketika hujan dan membasahi area dekat tempat tidur.',
        ],
        'AC Rusak' => [
            'title' => 'Keluhan AC Rusak',
            'desc' => 'AC menyala tetapi tidak mengeluarkan udara dingin dan terdengar suara tidak normal.',
        ],
        'Air Tidak Mengalir' => [
            'title' => 'Keluhan Air Tidak Mengalir',
            'desc' => 'Air tidak keluar dari keran kamar mandi sejak pagi.',
        ],
        'Lampu/Kelistrikan Bermasalah' => [
            'title' => 'Keluhan Lampu/Kelistrikan Bermasalah',
            'desc' => 'Lampu kamar sering berkedip dan stopkontak tidak berfungsi.',
        ],
        'Pintu atau Kunci Rusak' => [
            'title' => 'Keluhan Pintu atau Kunci Rusak',
            'desc' => 'Kunci pintu kamar macet dan sulit dibuka dari luar.',
        ],
        'Saluran Air Tersumbat' => [
            'title' => 'Keluhan Saluran Air Tersumbat',
            'desc' => 'Air di lubang pembuangan kamar mandi menggenang dan tersumbat.',
        ],
        'Kebersihan Area Bersama' => [
            'title' => 'Keluhan Kebersihan Area Bersama',
            'desc' => 'Sampah di area dapur bersama menumpuk dan belum dibersihkan.',
        ],
        'Internet Bermasalah' => [
            'title' => 'Keluhan Internet Bermasalah',
            'desc' => 'Koneksi Wi-Fi sering terputus dan lambat untuk bekerja.',
        ],
    ];

    private const EXPENSE_DESCRIPTIONS = [
        'Listrik' => 'Pembayaran tagihan listrik rutin area kost bulanan.',
        'Air' => 'Pembayaran tagihan PDAM air bersih bulanan.',
        'Internet' => 'Pembayaran langganan internet Wi-Fi kecepatan tinggi kost.',
        'Kebersihan' => 'Biaya jasa kebersihan lingkungan kost bulanan.',
        'Keamanan' => 'Biaya iuran keamanan dan hansip lingkungan kost.',
        'Perawatan/Perbaikan' => 'Biaya pemeliharaan rutin gedung dan fasilitas kost.',
    ];

    private array $kamars = [];
    private array $tenants = [];
    private array $rentals = [];
    private array $paymentMethodsPool = [];

    private array $compStats = [
        'pending' => 0,
        'proses' => 0,
        'selesai' => 0,
        'with_photo' => 0,
        'without_photo' => 0,
    ];
    private array $invoiceStats = [
        'lunas' => 0,
        'dibatalkan' => 0,
        'belum_bayar' => 0,
        'telat' => 0,
    ];
    private array $paymentStats = [
        'diterima' => 0,
        'pending' => 0,
        'ditolak' => 0,
    ];
    private array $paymentMethodStats = [
        'Transfer Bank' => 0,
        'Tunai' => 0,
        'E-Wallet' => 0,
    ];

    public function run(): void
    {
        $this->baseDate = Carbon::now(config('app.timezone', 'Asia/Jakarta'))->startOfDay();
        $this->historyStart = $this->baseDate->copy()->startOfMonth()->subMonths(35);

        $this->preflightValidation();

        try {
            $this->validateAndPublishAssets();
            DB::transaction(function () {
                $this->preserveAdmin();
                $this->seedRooms();
                $this->seedTenants();
                $this->seedRentalsAndInvoices();
                $this->seedComplaints();
                $this->seedGuestBook();
                $this->seedExpenses();
                $this->runAssertions();
            });
            $this->printSummary();
        } catch (\Exception $e) {
            $this->rollbackAssets();
            throw $e;
        }
    }

    private function deterministicCycle(int $min, int $max, int $seed): int
    {
        $range = $max - $min + 1;
        if ($range <= 0) {
            return $min;
        }
        return $min + ($seed % $range);
    }

    protected function preflightValidation(): void
    {
        $admins = User::where('role', 'admin')->get();
        $this->adminCountPreflight = $admins->count();
        foreach ($admins as $admin) {
            $this->preflightAdminIds[] = $admin->id;
            $this->preflightAdminHashes[$admin->id] = $admin->password;
        }
        $this->visitorCountPreflight = Visitor::count();

        $tables = [
            'Tenant Users' => User::where('role', 'penyewa')->count(),
            'Kamar' => Kamar::count(),
            'Riwayat Sewa' => RiwayatSewa::count(),
            'Tagihan' => Tagihan::count(),
            'Pembayaran' => Pembayaran::count(),
            'Keluhan' => Keluhan::count(),
            'Buku Tamu' => BukuTamu::count(),
            'Pengeluaran' => Pengeluaran::count(),
            'Notifikasi' => Notifikasi::count(),
        ];

        foreach ($tables as $entity => $count) {
            if ($count > 0) {
                throw new \RuntimeException("Preflight failed: $entity already has $count records.");
            }
        }
    }

    protected function validateAndPublishAssets(): void
    {
        $assetsDir = base_path('database/seeders/assets');
        $publicDisk = Storage::disk('public');

        foreach (self::ASSET_FILES as $key => $relPath) {
            $sourcePath = $assetsDir . '/' . $relPath;
            if (!File::exists($sourcePath)) {
                throw new \RuntimeException("Required asset missing: $relPath");
            }
            $destPath = self::PUBLISHED_ASSETS[$key];
            $dir = dirname($destPath);
            if (!$publicDisk->exists($dir)) {
                $publicDisk->makeDirectory($dir);
            }
            if ($publicDisk->exists($destPath)) {
                $this->overwrittenFiles[$destPath] = $publicDisk->get($destPath);
            } else {
                $this->newlyCreatedFiles[] = $destPath;
            }
            if (!$publicDisk->put($destPath, File::get($sourcePath))) {
                throw new \RuntimeException("Failed to publish $destPath");
            }
            $this->publishedPaths[$key] = $destPath;
        }
    }

    protected function rollbackAssets(): void
    {
        $disk = Storage::disk('public');
        foreach ($this->newlyCreatedFiles as $file) {
            $disk->delete($file);
        }
        foreach ($this->overwrittenFiles as $path => $content) {
            $disk->put($path, $content);
        }
    }

    protected function preserveAdmin(): void
    {
        if ($this->adminCountPreflight === 0) {
            $admin = User::create([
                'email' => 'admin@kost.com',
                'nama_lengkap' => 'Admin Kost',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'no_hp' => '081234567890',
                'alamat_asal' => 'Sistem',
            ]);
            $this->adminCountPreflight = 1;
            $this->preflightAdminIds[] = $admin->id;
            $this->preflightAdminHashes[$admin->id] = $admin->password;
        }
    }

    protected function seedRooms(): void
    {
        for ($i = 0; $i < self::TOTAL_KAMAR; $i++) {
            $status = $i < 30 ? 'terisi' : 'tersedia';
            $num = str_pad((string)(($i % 10) + 1), 2, '0', STR_PAD_LEFT);
            $this->kamars[] = Kamar::create([
                'nomor_kamar' => chr(65 + floor($i / 10)) . '-' . $num,
                'fasilitas' => 'Kasur, Lemari, Meja Belajar',
                'harga_bulanan' => 1000000 + (($i % 5) * 100000),
                'luas_kamar' => '3x4 m',
                'foto_kamar' => $this->publishedPaths['kamar'],
                'status_kamar' => $status,
            ]);
        }
    }

    protected function seedTenants(): void
    {
        for ($i = 0; $i < self::TOTAL_PENYEWA; $i++) {
            $this->tenants[] = User::create([
                'email' => "penyewa" . str_pad((string)($i + 1), 3, '0', STR_PAD_LEFT) . "@kost.com",
                'nama_lengkap' => "Penyewa " . ($i + 1),
                'password' => Hash::make('password123'),
                'role' => 'penyewa',
                'no_hp' => '08' . str_pad((string)($i + 1), 10, '1', STR_PAD_LEFT),
                'alamat_asal' => 'Kota ' . (($i % 10) + 1),
            ]);
        }
    }

    protected function seedRentalsAndInvoices(): void
    {
        $this->paymentMethodsPool = $this->buildPaymentMethodSequence();
        $paymentIdx = 0;

        $rentalStatuses = $this->buildInvoiceStatusAssignments();
        $globalInvId = 1;
        $tenantIdx = 0;
        $pendingLeft = self::TOTAL_PEMBAYARAN_PENDING;
        $ditolakLeft = self::TOTAL_PEMBAYARAN_DITOLAK;
        $activeIdx = self::TOTAL_SEWA_SELESAI;
        $completedIdx = 0;

        for ($roomId = 0; $roomId < self::TOTAL_KAMAR; $roomId++) {
            $kamar = $this->kamars[$roomId];

            if ($roomId < 30) {
                $activeStart = $this->createActiveRentalForRoom(
                    $kamar,
                    $tenantIdx,
                    $activeIdx,
                    $rentalStatuses,
                    $globalInvId,
                    $paymentIdx,
                    $pendingLeft,
                    $ditolakLeft
                );
                $this->createCompletedRentalsForRoomBackward(
                    $kamar,
                    $activeStart,
                    5,
                    [5, 5, 5, 4, 4],
                    $tenantIdx,
                    $completedIdx,
                    $rentalStatuses,
                    $globalInvId,
                    $paymentIdx,
                    $pendingLeft,
                    $ditolakLeft
                );
            } else {
                $startAnchor = $this->historyStart->copy()->addDays($roomId - 30 + 1);
                $this->createCompletedRentalsForRoomForward(
                    $kamar,
                    $startAnchor,
                    4,
                    [4, 4, 4, 4],
                    $tenantIdx,
                    $completedIdx,
                    $rentalStatuses,
                    $globalInvId,
                    $paymentIdx,
                    $pendingLeft,
                    $ditolakLeft
                );
            }
        }
        ksort($this->rentals);
    }

    private function getRentalDuration(int $rIdx): int
    {
        if ($rIdx >= self::TOTAL_SEWA_SELESAI) {
            return 5;
        }
        if ($rIdx >= 150) {
            return 4;
        }
        $subIdx = $rIdx % 5;
        if ($subIdx === 0 || $subIdx === 1) {
            return 4;
        }
        return 5;
    }

    private function buildInvoiceStatusAssignments(): array
    {
        $rentalStatuses = array_fill(0, self::TOTAL_PENYEWA, []);

        for ($i = 0; $i < self::TOTAL_TAGIHAN_BELUM_BAYAR; $i++) {
            $rentalStatuses[191 + ($i % 29)][] = 'belum_bayar';
        }
        for ($i = 0; $i < self::TOTAL_TAGIHAN_TELAT; $i++) {
            $rentalStatuses[191 + (($i + 15) % 29)][] = 'telat';
        }

        $lunasLeft = self::TOTAL_TAGIHAN_LUNAS;
        $batalLeft = self::TOTAL_TAGIHAN_BATAL;

        for ($rIdx = self::TOTAL_SEWA_SELESAI; $rIdx < self::TOTAL_PENYEWA; $rIdx++) {
            $needed = 5 - count($rentalStatuses[$rIdx]);
            for ($k = 0; $k < $needed; $k++) {
                if ($lunasLeft > 0) {
                    $rentalStatuses[$rIdx][] = 'lunas';
                    $lunasLeft--;
                }
            }
        }

        for ($rIdx = 0; $rIdx < self::TOTAL_SEWA_SELESAI; $rIdx++) {
            $needed = $this->getRentalDuration($rIdx);
            for ($k = 0; $k < $needed; $k++) {
                if ($batalLeft > 0 && ($rIdx + $k) % 6 === 0) {
                    $rentalStatuses[$rIdx][] = 'dibatalkan';
                    $batalLeft--;
                } elseif ($lunasLeft > 0) {
                    $rentalStatuses[$rIdx][] = 'lunas';
                    $lunasLeft--;
                } else {
                    $rentalStatuses[$rIdx][] = 'dibatalkan';
                    $batalLeft--;
                }
            }
        }
        return $rentalStatuses;
    }

    private function buildPaymentMethodSequence(): array
    {
        $sequence = [];
        $counts = [
            'Transfer Bank' => self::TOTAL_PEMBAYARAN_TRANSFER_BANK,
            'Tunai' => self::TOTAL_PEMBAYARAN_TUNAI,
            'E-Wallet' => self::TOTAL_PEMBAYARAN_E_WALLET,
        ];

        $keys = array_keys($counts);
        $idx = 0;

        for ($i = 0; $i < self::TOTAL_PEMBAYARAN; $i++) {
            $attempts = 0;
            while ($counts[$keys[$idx]] === 0 && $attempts < 3) {
                $idx = ($idx + 1) % 3;
                $attempts++;
            }
            $method = $keys[$idx];
            $sequence[] = $method;
            $counts[$method]--;
            $idx = ($idx + 1) % 3;
        }

        return $sequence;
    }

    private function createActiveRentalForRoom(
        Kamar $kamar,
        int &$tenantIdx,
        int &$activeIdx,
        array $rentalStatuses,
        int &$globalInvId,
        int &$paymentIdx,
        int &$pendingLeft,
        int &$ditolakLeft
    ): Carbon {
        $activeDur = 5;
        $activeEnd = $this->baseDate->copy()->addDays($this->deterministicCycle(14, 30, $activeIdx));
        $activeStart = $activeEnd->copy()->subMonths($activeDur);
        if ($activeStart->gt($this->baseDate)) {
            $activeStart = $this->baseDate->copy()->subDays(5);
            $activeEnd = $activeStart->copy()->addMonths($activeDur);
        }

        $sewa = RiwayatSewa::create([
            'id_user' => $this->tenants[$tenantIdx++]->id,
            'id_kamar' => $kamar->id_kamar,
            'tanggal_masuk' => $activeStart->toDateString(),
            'tanggal_keluar' => $activeEnd->toDateString(),
            'harga_deal' => $kamar->harga_bulanan * $activeDur,
            'durasi_sewa_bulan' => $activeDur,
            'status_sewa' => 'aktif',
        ]);
        $this->rentals[$activeIdx] = [
            'model' => $sewa,
            'active' => true,
        ];
        $this->createInvoicesForRental(
            $sewa,
            $rentalStatuses[$activeIdx],
            $globalInvId,
            $paymentIdx,
            $pendingLeft,
            $ditolakLeft
        );
        $activeIdx++;
        return $activeStart;
    }

    private function createCompletedRentalsForRoomBackward(
        Kamar $kamar,
        Carbon $anchorDate,
        int $count,
        array $durations,
        int &$tenantIdx,
        int &$completedIdx,
        array $rentalStatuses,
        int &$globalInvId,
        int &$paymentIdx,
        int &$pendingLeft,
        int &$ditolakLeft
    ): void {
        $rentalsData = [];
        $currentAnchor = $anchorDate->copy()->subDays($this->deterministicCycle(3, 10, $completedIdx));

        for ($c = 0; $c < $count; $c++) {
            $dur = $durations[$c];
            $end = $currentAnchor->copy();
            $start = $end->copy()->subMonths($dur);
            if ($start->lt($this->historyStart)) {
                throw new \RuntimeException(
                    "Rental start date {$start->toDateString()} is before history start {$this->historyStart->toDateString()}"
                );
            }
            $rentalsData[] = [
                'start' => $start,
                'end' => $end,
                'dur' => $dur,
            ];
            $currentAnchor = $start->copy()->subDays($this->deterministicCycle(3, 10, $completedIdx + $c));
        }
        $rentalsData = array_reverse($rentalsData);

        foreach ($rentalsData as $rData) {
            $sewa = RiwayatSewa::create([
                'id_user' => $this->tenants[$tenantIdx++]->id,
                'id_kamar' => $kamar->id_kamar,
                'tanggal_masuk' => $rData['start']->toDateString(),
                'tanggal_keluar' => $rData['end']->toDateString(),
                'harga_deal' => $kamar->harga_bulanan * $rData['dur'],
                'durasi_sewa_bulan' => $rData['dur'],
                'status_sewa' => 'selesai',
            ]);
            $this->rentals[$completedIdx] = [
                'model' => $sewa,
                'active' => false,
            ];
            $this->createInvoicesForRental(
                $sewa,
                $rentalStatuses[$completedIdx],
                $globalInvId,
                $paymentIdx,
                $pendingLeft,
                $ditolakLeft
            );
            $completedIdx++;
        }
    }

    private function createCompletedRentalsForRoomForward(
        Kamar $kamar,
        Carbon $startAnchor,
        int $count,
        array $durations,
        int &$tenantIdx,
        int &$completedIdx,
        array $rentalStatuses,
        int &$globalInvId,
        int &$paymentIdx,
        int &$pendingLeft,
        int &$ditolakLeft
    ): void {
        $currentStart = $startAnchor->copy();
        for ($c = 0; $c < $count; $c++) {
            $dur = $durations[$c];
            $end = $currentStart->copy()->addMonths($dur);
            if ($end->gt($this->baseDate)) {
                $end = $this->baseDate->copy()->subDays(1);
            }

            $sewa = RiwayatSewa::create([
                'id_user' => $this->tenants[$tenantIdx++]->id,
                'id_kamar' => $kamar->id_kamar,
                'tanggal_masuk' => $currentStart->toDateString(),
                'tanggal_keluar' => $end->toDateString(),
                'harga_deal' => $kamar->harga_bulanan * $dur,
                'durasi_sewa_bulan' => $dur,
                'status_sewa' => 'selesai',
            ]);
            $this->rentals[$completedIdx] = [
                'model' => $sewa,
                'active' => false,
            ];
            $this->createInvoicesForRental(
                $sewa,
                $rentalStatuses[$completedIdx],
                $globalInvId,
                $paymentIdx,
                $pendingLeft,
                $ditolakLeft
            );
            $completedIdx++;
            $currentStart = $end->copy()->addDays($this->deterministicCycle(3, 10, $completedIdx + $c));
        }
    }

    private function createInvoicesForRental(
        RiwayatSewa $sewa,
        array $statuses,
        int &$globalInvId,
        int &$paymentIdx,
        int &$pendingLeft,
        int &$ditolakLeft
    ): void {
        $masuk = Carbon::parse($sewa->tanggal_masuk);
        $order = [
            'lunas' => 1,
            'dibatalkan' => 2,
            'telat' => 3,
            'belum_bayar' => 4,
        ];
        usort($statuses, fn($a, $b) => $order[$a] <=> $order[$b]);

        $currentYearStart = $this->baseDate->copy()->startOfYear();

        foreach ($statuses as $i => $status) {
            $this->invoiceStats[$status]++;

            $tglTagihan = $masuk->copy()->addMonthsNoOverflow($i);
            $jatuhTempo = $tglTagihan->copy()->addDays(14);

            if ($status === 'belum_bayar') {
                $tagihanOffset = $this->deterministicCycle(0, 14, $globalInvId);
                $tglTagihan = $this->baseDate->copy()->subDays($tagihanOffset);
                if ($tglTagihan->lt($currentYearStart)) {
                    $tglTagihan = $currentYearStart->copy();
                }
                $jatuhTempo = $tglTagihan->copy()->addDays(14);
            } elseif ($status === 'telat') {
                $tempoOffset = $this->deterministicCycle(1, 30, $globalInvId);
                $jatuhTempo = $this->baseDate->copy()->subDays($tempoOffset);
                $tglTagihan = $jatuhTempo->copy()->subDays(14);
                if ($tglTagihan->lt($currentYearStart)) {
                    $tglTagihan = $currentYearStart->copy();
                }
            } else {
                if ($tglTagihan->gt($this->baseDate)) {
                    $tglTagihan = $this->baseDate->copy()->subDays(15);
                    $jatuhTempo = $tglTagihan->copy()->addDays(14);
                }
            }

            if ($tglTagihan->lt($this->historyStart)) {
                throw new \RuntimeException(
                    "Invoice date {$tglTagihan->toDateString()} is before history start {$this->historyStart->toDateString()}"
                );
            }

            $tagihan = Tagihan::create([
                'id_sewa' => $sewa->id_sewa,
                'kode_invoice' => 'INV-' . str_pad((string)$globalInvId, 4, '0', STR_PAD_LEFT),
                'tanggal_tagihan' => $tglTagihan->toDateString(),
                'tanggal_jatuh_tempo' => $jatuhTempo->toDateString(),
                'total_tagihan' => $sewa->harga_deal / max(1, $sewa->durasi_sewa_bulan),
                'status_tagihan' => $status,
            ]);

            $createPayment = false;
            $verifikasi = null;

            if ($status === 'lunas') {
                $createPayment = true;
                $verifikasi = 'diterima';
            } elseif ($status === 'belum_bayar') {
                if ($pendingLeft > 0) {
                    $createPayment = true;
                    $verifikasi = 'pending';
                    $pendingLeft--;
                }
            } elseif ($status === 'telat') {
                if ($ditolakLeft > 0) {
                    $createPayment = true;
                    $verifikasi = 'ditolak';
                    $ditolakLeft--;
                }
            }

            if ($createPayment) {
                $method = $this->paymentMethodsPool[$paymentIdx++];
                $this->paymentMethodStats[$method]++;
                $this->paymentStats[$verifikasi]++;

                $proof = null;
                if ($method === 'Transfer Bank') {
                    $proof = ($paymentIdx % 2 === 0)
                        ? $this->publishedPaths['transfer_bank_1']
                        : $this->publishedPaths['transfer_bank_2'];
                } elseif ($method === 'Tunai') {
                    $proof = $this->publishedPaths['cash'];
                } elseif ($method === 'E-Wallet') {
                    $proof = $this->publishedPaths['e_wallet'];
                }

                if ($verifikasi === 'diterima') {
                    $tglBayar = $tglTagihan->copy()->addDays($this->deterministicCycle(0, 5, $globalInvId));
                    if ($tglBayar->gt($this->baseDate)) {
                        $tglBayar = $this->baseDate->copy();
                    }
                } elseif ($verifikasi === 'pending') {
                    $desiredRecentDate = $this->baseDate->copy()->subDays(
                        $this->deterministicCycle(0, 7, $globalInvId)
                    );
                    $tglBayar = $tglTagihan->gt($desiredRecentDate)
                        ? $tglTagihan->copy()
                        : $desiredRecentDate;
                } else {
                    $desiredRecentDate = $this->baseDate->copy()->subDays(
                        $this->deterministicCycle(0, 30, $globalInvId)
                    );
                    $tglBayar = $tglTagihan->gt($desiredRecentDate)
                        ? $tglTagihan->copy()
                        : $desiredRecentDate;
                }

                Pembayaran::create([
                    'id_tagihan' => $tagihan->id_tagihan,
                    'tanggal_bayar' => $tglBayar->toDateString(),
                    'jumlah_bayar' => $tagihan->total_tagihan,
                    'metode_pembayaran' => $method,
                    'bukti_bayar' => $proof,
                    'status_verifikasi' => $verifikasi,
                ]);
            }
            $globalInvId++;
        }
    }

    protected function seedComplaints(): void
    {
        $categories = [
            'Atap Bocor',
            'AC Rusak',
            'Air Tidak Mengalir',
            'Lampu/Kelistrikan Bermasalah',
            'Pintu atau Kunci Rusak',
            'Saluran Air Tersumbat',
            'Kebersihan Area Bersama',
            'Internet Bermasalah',
        ];

        for ($i = 0; $i < self::TOTAL_KELUHAN; $i++) {
            if ($i < 90) {
                $cat = 'Atap Bocor';
                $foto = $this->publishedPaths['keluhan_atap_bocor'];
                $this->compStats['with_photo']++;
            } elseif ($i < 180) {
                $cat = 'AC Rusak';
                $foto = $this->publishedPaths['keluhan_ac_rusak'];
                $this->compStats['with_photo']++;
            } else {
                $cat = $categories[2 + ($i % 6)];
                $foto = null;
                $this->compStats['without_photo']++;
            }

            $map = self::COMPLAINT_MAP[$cat];

            if ($i < self::TOTAL_KELUHAN_SELESAI) {
                $sewa = $this->rentals[$i]['model'];
                $status = 'selesai';
                $tglLapor = Carbon::parse($sewa->tanggal_masuk)->addDays(5);
                $tglSelesai = $tglLapor->copy()->addDays(2);
            } elseif ($i < self::TOTAL_KELUHAN_SELESAI + self::TOTAL_KELUHAN_PROSES) {
                $sewa = $this->rentals[190 + ($i % 30)]['model'];
                $status = 'proses';
                $tglLapor = $this->baseDate->copy()->subDays($this->deterministicCycle(1, 15, $i));
                $tglSelesai = null;
            } else {
                $sewa = $this->rentals[190 + ($i % 30)]['model'];
                $status = 'pending';
                $tglLapor = $this->baseDate->copy()->subDays($this->deterministicCycle(1, 5, $i));
                $tglSelesai = null;
            }

            $this->compStats[$status]++;

            Keluhan::create([
                'id_sewa' => $sewa->id_sewa,
                'judul_keluhan' => $map['title'],
                'deskripsi_keluhan' => $map['desc'],
                'foto_kerusakan' => $foto,
                'status_keluhan' => $status,
                'tanggal_lapor' => $tglLapor->toDateTimeString(),
                'tanggal_selesai' => $tglSelesai?->toDateTimeString(),
            ]);
        }
    }

    protected function seedGuestBook(): void
    {
        $purposes = [
            'Mengantar barang',
            'Kunjungan keluarga',
            'Belajar bersama',
            'Mengambil dokumen',
        ];

        for ($i = 0; $i < self::TOTAL_BUKU_TAMU; $i++) {
            $sewaInfo = $this->rentals[$i % self::TOTAL_PENYEWA];
            $sewa = $sewaInfo['model'];
            $masuk = Carbon::parse($sewa->tanggal_masuk);
            $keluar = Carbon::parse($sewa->tanggal_keluar);
            $days = max(1, $masuk->diffInDays($keluar));
            $tgl = $masuk->copy()->addDays($this->deterministicCycle(0, $days, $i));
            if ($tgl->gt($this->baseDate)) {
                $tgl = $this->baseDate->copy()->subDays(1);
            }

            BukuTamu::create([
                'nama_tamu' => 'Tamu ' . ($i + 1),
                'no_hp_tamu' => '08' . str_pad((string)($i + 1), 10, '2', STR_PAD_LEFT),
                'bertemu_dengan' => $sewa->id_user,
                'keperluan' => $purposes[$i % 4],
                'waktu_berkunjung' => $tgl->toDateTimeString(),
            ]);
        }
    }

    protected function seedExpenses(): void
    {
        $admin = User::where('role', 'admin')->first();
        if (!$admin) {
            return;
        }

        $categories = ['Listrik', 'Air', 'Internet', 'Kebersihan', 'Keamanan', 'Perawatan/Perbaikan'];
        $baseAmounts = [2000000, 800000, 500000, 1000000, 1500000, 500000];
        $varAmounts = [2000000, 700000, 500000, 1000000, 1000000, 2500000];

        for ($m = 35; $m >= 0; $m--) {
            $monthStart = $this->baseDate->copy()->subMonths($m)->startOfMonth();
            for ($i = 0; $i < 6; $i++) {
                $variationPercent = (($m * 37) + ($i * 17)) % 101;
                $variation = (int) round($varAmounts[$i] * ($variationPercent / 100));
                $amount = $baseAmounts[$i] + $variation;

                Pengeluaran::create([
                    'judul_pengeluaran' => "Biaya " . $categories[$i],
                    'deskripsi' => self::EXPENSE_DESCRIPTIONS[$categories[$i]],
                    'jumlah_pengeluaran' => $amount,
                    'tanggal_pengeluaran' => $monthStart->copy()->addDays($i + 1)->toDateString(),
                    'bukti_foto' => null,
                    'dibuat_oleh' => $admin->id,
                ]);
            }
        }
    }

    protected function runAssertions(): void
    {
        $cKamar = Kamar::count();
        if ($cKamar !== self::TOTAL_KAMAR) {
            throw new \Exception("Assert: Kamar count $cKamar != " . self::TOTAL_KAMAR);
        }
        $cKamarTerisi = Kamar::where('status_kamar', 'terisi')->count();
        if ($cKamarTerisi !== 30) {
            throw new \Exception("Assert: Kamar terisi count $cKamarTerisi != 30");
        }
        $cKamarTersedia = Kamar::where('status_kamar', 'tersedia')->count();
        if ($cKamarTersedia !== 10) {
            throw new \Exception("Assert: Kamar tersedia count $cKamarTersedia != 10");
        }

        $cPenyewa = User::where('role', 'penyewa')->count();
        if ($cPenyewa !== self::TOTAL_PENYEWA) {
            throw new \Exception("Assert: Penyewa $cPenyewa != " . self::TOTAL_PENYEWA);
        }
        $uniqueEmails = User::where('role', 'penyewa')->distinct('email')->count();
        if ($uniqueEmails !== self::TOTAL_PENYEWA) {
            throw new \Exception("Assert: Penyewa emails are not unique");
        }

        $uniqueRoomNums = Kamar::distinct('nomor_kamar')->count();
        if ($uniqueRoomNums !== self::TOTAL_KAMAR) {
            throw new \Exception("Assert: Kamar numbers are not unique");
        }

        $cSewaAktif = RiwayatSewa::where('status_sewa', 'aktif')->count();
        $cSewaSelesai = RiwayatSewa::where('status_sewa', 'selesai')->count();
        if ($cSewaAktif !== self::TOTAL_SEWA_AKTIF) {
            throw new \Exception("Assert: Aktif rentals $cSewaAktif != " . self::TOTAL_SEWA_AKTIF);
        }
        if ($cSewaSelesai !== self::TOTAL_SEWA_SELESAI) {
            throw new \Exception("Assert: Selesai rentals $cSewaSelesai != " . self::TOTAL_SEWA_SELESAI);
        }

        if (Tagihan::count() !== self::TOTAL_TAGIHAN) {
            throw new \Exception("Assert: Invoices != " . self::TOTAL_TAGIHAN);
        }
        if (Tagihan::where('status_tagihan', 'lunas')->count() !== self::TOTAL_TAGIHAN_LUNAS) {
            throw new \Exception("Assert: Lunas != " . self::TOTAL_TAGIHAN_LUNAS);
        }
        if (Tagihan::where('status_tagihan', 'dibatalkan')->count() !== self::TOTAL_TAGIHAN_BATAL) {
            throw new \Exception("Assert: Dibatalkan != " . self::TOTAL_TAGIHAN_BATAL);
        }
        if (Tagihan::where('status_tagihan', 'belum_bayar')->count() !== self::TOTAL_TAGIHAN_BELUM_BAYAR) {
            throw new \Exception("Assert: Belum_bayar != " . self::TOTAL_TAGIHAN_BELUM_BAYAR);
        }
        if (Tagihan::where('status_tagihan', 'telat')->count() !== self::TOTAL_TAGIHAN_TELAT) {
            throw new \Exception("Assert: Telat != " . self::TOTAL_TAGIHAN_TELAT);
        }
        $uniqueInvoiceCodes = Tagihan::distinct('kode_invoice')->count();
        if ($uniqueInvoiceCodes !== self::TOTAL_TAGIHAN) {
            throw new \Exception("Assert: Invoice codes are not unique");
        }

        foreach (Tagihan::all() as $t) {
            $sewa = RiwayatSewa::find($t->id_sewa);
            if (!$sewa) {
                throw new \Exception("Assert: Invoice {$t->kode_invoice} has no rental");
            }
            $masuk = Carbon::parse($sewa->tanggal_masuk);
            $keluar = Carbon::parse($sewa->tanggal_keluar);
            $tagihanDate = Carbon::parse($t->tanggal_tagihan);
            $due = Carbon::parse($t->tanggal_jatuh_tempo);

            if ($tagihanDate->lt($masuk) || $tagihanDate->gt($keluar)) {
                throw new \Exception("Assert: Invoice {$t->kode_invoice} date {$t->tanggal_tagihan} is outside rental {$masuk->toDateString()} to {$keluar->toDateString()}");
            }
            if ($due->gt($keluar)) {
                throw new \Exception("Assert: Invoice {$t->kode_invoice} due date {$t->tanggal_jatuh_tempo} is after rental end {$keluar->toDateString()}");
            }
            if ($tagihanDate->gt($due)) {
                throw new \Exception("Assert: Invoice {$t->kode_invoice} date {$t->tanggal_tagihan} is after due date {$t->tanggal_jatuh_tempo}");
            }
            if ($tagihanDate->lt($this->historyStart)) {
                throw new \Exception("Assert: Invoice {$t->kode_invoice} date is before historyStart");
            }
        }

        if (Pembayaran::count() !== self::TOTAL_PEMBAYARAN) {
            throw new \Exception("Assert: Pembayaran != " . self::TOTAL_PEMBAYARAN);
        }
        if (Pembayaran::where('status_verifikasi', 'diterima')->count() !== self::TOTAL_PEMBAYARAN_DITERIMA) {
            throw new \Exception("Assert: Diterima != " . self::TOTAL_PEMBAYARAN_DITERIMA);
        }
        if (Pembayaran::where('status_verifikasi', 'pending')->count() !== self::TOTAL_PEMBAYARAN_PENDING) {
            throw new \Exception("Assert: Pending != " . self::TOTAL_PEMBAYARAN_PENDING);
        }
        if (Pembayaran::where('status_verifikasi', 'ditolak')->count() !== self::TOTAL_PEMBAYARAN_DITOLAK) {
            throw new \Exception("Assert: Ditolak != " . self::TOTAL_PEMBAYARAN_DITOLAK);
        }

        $cBank = Pembayaran::where('metode_pembayaran', 'Transfer Bank')->count();
        if ($cBank !== self::TOTAL_PEMBAYARAN_TRANSFER_BANK) {
            throw new \Exception("Assert: Transfer Bank payment count $cBank != " . self::TOTAL_PEMBAYARAN_TRANSFER_BANK);
        }
        $cTunai = Pembayaran::where('metode_pembayaran', 'Tunai')->count();
        if ($cTunai !== self::TOTAL_PEMBAYARAN_TUNAI) {
            throw new \Exception("Assert: Tunai payment count $cTunai != " . self::TOTAL_PEMBAYARAN_TUNAI);
        }
        $cWallet = Pembayaran::where('metode_pembayaran', 'E-Wallet')->count();
        if ($cWallet !== self::TOTAL_PEMBAYARAN_E_WALLET) {
            throw new \Exception("Assert: E-Wallet payment count $cWallet != " . self::TOTAL_PEMBAYARAN_E_WALLET);
        }

        foreach (Pembayaran::all() as $p) {
            $t = Tagihan::find($p->id_tagihan);
            $payDate = Carbon::parse($p->tanggal_bayar);
            $tagDate = Carbon::parse($t->tanggal_tagihan);

            if ($payDate->lt($tagDate)) {
                throw new \Exception("Assert: Payment date {$p->tanggal_bayar} is before invoice date {$t->tanggal_tagihan}");
            }
            if ($payDate->gt($this->baseDate)) {
                throw new \Exception("Assert: Payment date {$p->tanggal_bayar} is after baseDate");
            }
            if ($payDate->lt($this->historyStart)) {
                throw new \Exception("Assert: Payment date {$p->tanggal_bayar} is before historyStart");
            }
        }

        $cancelledTags = Tagihan::where('status_tagihan', 'dibatalkan')->pluck('id_tagihan');
        $cancelledPayCount = Pembayaran::whereIn('id_tagihan', $cancelledTags)->count();
        if ($cancelledPayCount !== 0) {
            throw new \Exception("Assert: Cancelled invoices have $cancelledPayCount payments");
        }

        if (Keluhan::count() !== self::TOTAL_KELUHAN) {
            throw new \Exception("Assert: Keluhan != " . self::TOTAL_KELUHAN);
        }
        if (Keluhan::where('status_keluhan', 'selesai')->count() !== self::TOTAL_KELUHAN_SELESAI) {
            throw new \Exception("Assert: Keluhan selesai != " . self::TOTAL_KELUHAN_SELESAI);
        }
        if (Keluhan::where('status_keluhan', 'proses')->count() !== self::TOTAL_KELUHAN_PROSES) {
            throw new \Exception("Assert: Keluhan proses != " . self::TOTAL_KELUHAN_PROSES);
        }
        if (Keluhan::where('status_keluhan', 'pending')->count() !== self::TOTAL_KELUHAN_PENDING) {
            throw new \Exception("Assert: Keluhan pending != " . self::TOTAL_KELUHAN_PENDING);
        }

        if (BukuTamu::count() !== self::TOTAL_BUKU_TAMU) {
            throw new \Exception("Assert: BukuTamu != " . self::TOTAL_BUKU_TAMU);
        }

        if (Pengeluaran::count() !== self::TOTAL_PENGELUARAN) {
            throw new \Exception("Assert: Pengeluaran != " . self::TOTAL_PENGELUARAN);
        }

        $currentAdmins = User::where('role', 'admin')->get();
        if ($currentAdmins->count() !== $this->adminCountPreflight) {
            throw new \Exception("Assert: Admin count changed");
        }
        foreach ($currentAdmins as $a) {
            if (!in_array($a->id, $this->preflightAdminIds, true)) {
                throw new \Exception("Assert: Admin mutated");
            }
            if ($this->preflightAdminHashes[$a->id] !== $a->password) {
                throw new \Exception("Assert: Admin password mutated");
            }
        }
        if (Visitor::count() !== $this->visitorCountPreflight) {
            throw new \Exception("Assert: Visitor count changed");
        }

        $publicDisk = Storage::disk('public');
        foreach (self::PUBLISHED_ASSETS as $path) {
            if (!$publicDisk->exists($path)) {
                throw new \Exception("Assert: Asset path $path does not exist");
            }
        }
    }

    protected function printSummary(): void
    {
        // Minimal summary
    }
}
