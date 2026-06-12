<?php

namespace Database\Seeders;

use App\Models\BukuTamu;
use App\Models\Kamar;
use App\Models\Keluhan;
use App\Models\Notifikasi;
use App\Models\Pembayaran;
use App\Models\Pengeluaran;
use App\Models\RiwayatSewa;
use App\Models\Tagihan;
use App\Models\User;
use App\Models\Visitor;
use App\Services\AuthService;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class WorkflowDemoSeeder extends Seeder
{
    protected Carbon $baseDate;
    protected array $sourceAssets = [];
    protected array $selectedAssets = [];
    protected array $publishedPaths = [];
    protected array $overwrittenFiles = [];
    protected array $newlyCreatedFiles = [];
    protected int $adminCountPreflight = 0;
    protected int $visitorCountPreflight = 0;
    protected array $preflightAdminIds = [];
    protected array $preflightAdminHashes = [];

    protected array $kamars = [];
    protected array $tenants = [];
    protected array $activeRentals = [];
    protected array $completedRentals = [];
    protected int $initialInvoiceCounter = 1;
    protected int $extInvoiceCounter = 1;

    private const PERFORMANCE_INVOICE_TARGET = 1000;

    protected int $performanceInvoiceCount = 0;

    protected array $extStats = [
        'accepted' => 0,
        'pending' => 0,
        'rejected' => 0,
        'unpaid_not_due' => 0,
        'overdue' => 0,
    ];
    protected array $compStats = [
        'pending' => 0,
        'proses' => 0,
        'selesai' => 0,
        'with_photo' => 0,
        'without_photo' => 0,
    ];

    public function run(): void
    {
        $this->baseDate = Carbon::now(config('app.timezone', 'Asia/Jakarta'))->startOfDay();

        $this->preflightValidation();
        $this->discoverSourceAssets();
        $this->validateSourceAssets();
        $this->publishSelectedAssets();

        try {
            DB::transaction(function () {
                $this->preserveAdmin();
                $this->seedRooms();
                $this->seedTenants();
                $this->seedRentalsAndInvoices();
                $this->seedPerformanceInvoices();
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

    protected function preflightValidation(): void
    {
        $admins = User::where('role', 'admin')->get();
        $this->adminCountPreflight = $admins->count();
        foreach ($admins as $admin) {
            $this->preflightAdminIds[] = $admin->id;
            $this->preflightAdminHashes[$admin->id] = $admin->password;
        }
        $this->visitorCountPreflight = Visitor::count();

        $counts = [
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

        foreach ($counts as $entity => $count) {
            if ($count > 0) {
                throw new \RuntimeException("Preflight failed: $entity already has $count records.");
            }
        }
    }

    protected function discoverSourceAssets(): void
    {
        $assetsDir = base_path('database/seeders/assets');
        $types = ['kamar', 'tagihan', 'keluhan'];
        $allowedExts = ['jpg', 'jpeg', 'png', 'webp'];

        foreach ($types as $type) {
            $path = $assetsDir . '/' . $type;
            if (File::exists($path)) {
                $files = File::files($path);
                $validFiles = [];
                foreach ($files as $file) {
                    $ext = strtolower($file->getExtension());
                    if (in_array($ext, $allowedExts)) {
                        $validFiles[] = $file->getPathname();
                    }
                }
                sort($validFiles);
                $this->sourceAssets[$type] = $validFiles;
            } else {
                $this->sourceAssets[$type] = [];
            }
        }
    }

    protected function validateSourceAssets(): void
    {
        if (!empty($this->sourceAssets['kamar'])) {
            $this->selectedAssets['kamar'] = $this->sourceAssets['kamar'][0];
        }
        if (!empty($this->sourceAssets['tagihan'])) {
            $this->selectedAssets['tagihan'] = $this->sourceAssets['tagihan'][0];
        }
        if (isset($this->sourceAssets['keluhan'][0])) {
            $this->selectedAssets['keluhan_1'] = $this->sourceAssets['keluhan'][0];
        }
        if (isset($this->sourceAssets['keluhan'][1])) {
            $this->selectedAssets['keluhan_2'] = $this->sourceAssets['keluhan'][1];
        }
    }

    protected function publishSelectedAssets(): void
    {
        $publicDisk = Storage::disk('public');

        if (isset($this->selectedAssets['kamar'])) {
            $ext = strtolower(pathinfo($this->selectedAssets['kamar'], PATHINFO_EXTENSION));
            $this->publishedPaths['kamar'] = $this->safePublish($this->selectedAssets['kamar'], 'demo/kamar', "kamar-1.$ext", $publicDisk);
        }

        if (isset($this->selectedAssets['tagihan'])) {
            $ext = strtolower(pathinfo($this->selectedAssets['tagihan'], PATHINFO_EXTENSION));
            $this->publishedPaths['tagihan'] = $this->safePublish($this->selectedAssets['tagihan'], 'demo/bukti-bayar', "proof-1.$ext", $publicDisk);
        }

        if (isset($this->selectedAssets['keluhan_1'])) {
            $ext = strtolower(pathinfo($this->selectedAssets['keluhan_1'], PATHINFO_EXTENSION));
            $this->publishedPaths['keluhan_1'] = $this->safePublish($this->selectedAssets['keluhan_1'], 'demo/keluhan', "comp-1.$ext", $publicDisk);
        }

        if (isset($this->selectedAssets['keluhan_2'])) {
            $ext = strtolower(pathinfo($this->selectedAssets['keluhan_2'], PATHINFO_EXTENSION));
            $this->publishedPaths['keluhan_2'] = $this->safePublish($this->selectedAssets['keluhan_2'], 'demo/keluhan', "comp-2.$ext", $publicDisk);
        }
    }

    protected function safePublish(string $sourcePath, string $dir, string $fileName, \Illuminate\Contracts\Filesystem\Filesystem $disk): string
    {
        if (!$disk->exists($dir)) {
            $disk->makeDirectory($dir);
        }

        $destPath = $dir . '/' . $fileName;

        if ($disk->exists($destPath)) {
            $this->overwrittenFiles[$destPath] = $disk->get($destPath);
        } else {
            $this->newlyCreatedFiles[] = $destPath;
        }

        $success = $disk->put($destPath, File::get($sourcePath));
        if (!$success) {
            throw new \RuntimeException("Failed to publish asset to $destPath");
        }

        return $destPath;
    }

    protected function rollbackAssets(): void
    {
        $disk = Storage::disk('public');

        foreach ($this->newlyCreatedFiles as $file) {
            if ($disk->exists($file)) {
                $disk->delete($file);
            }
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
        $roomImagePath = $this->publishedPaths['kamar'] ?? null;

        for ($i = 1; $i <= 40; $i++) {
            $status = $i <= 30 ? 'terisi' : 'tersedia';
            $floor = ceil($i / 10);
            $char = chr(64 + $floor);
            $num = str_pad((string)($i % 10 === 0 ? 10 : $i % 10), 2, '0', STR_PAD_LEFT);
            $nomor = $char . '-' . $num;

            $kamar = Kamar::create([
                'nomor_kamar' => $nomor,
                'fasilitas' => 'Kasur, Lemari, Meja Belajar',
                'harga_bulanan' => 1000000 + (($i % 5) * 100000),
                'luas_kamar' => '3x4 m',
                'foto_kamar' => $roomImagePath,
                'status_kamar' => $status,
            ]);
            $this->kamars[$i] = $kamar;
        }
    }

    protected function seedTenants(): void
    {
        for ($i = 1; $i <= 100; $i++) {
            $num = str_pad((string)$i, 3, '0', STR_PAD_LEFT);
            $user = User::create([
                'email' => "penyewa{$num}@kost.com",
                'nama_lengkap' => "Penyewa {$num}",
                'password' => Hash::make('password123'),
                'role' => 'penyewa',
                'no_hp' => '08' . str_pad((string)$i, 10, '1', STR_PAD_LEFT),
                'alamat_asal' => 'Kota ' . $i,
            ]);
            $this->tenants[$i] = $user;
        }
    }

    protected function seedRentalsAndInvoices(): void
    {
        $proofImagePath = $this->publishedPaths['tagihan'] ?? null;

        for ($room = 1; $room <= 30; $room++) {
            $kamar = $this->kamars[$room];
            $tenantId = $room;
            $user = $this->tenants[$tenantId];

            $baseDuration = ($room % 6) + 1;
            $daysFuture = ($room * 3) % ($baseDuration * 28) + 1;
            $activeEnd = $this->baseDate->copy()->addDays($daysFuture);

            $hasExtension = ($room <= 20);
            $extType = $hasExtension ? ($room % 5) : -1;

            $totalDuration = $baseDuration;
            $extDuration = 1;

            if ($hasExtension && $extType === 0) { // accepted
                $totalDuration += $extDuration;
                $activeStart = $activeEnd->copy()->subMonths($totalDuration);
                $originalEnd = $activeEnd->copy()->subMonths($extDuration);
            } else {
                $activeStart = $activeEnd->copy()->subMonths($baseDuration);
                $originalEnd = $activeEnd;
            }

            $sewaAktif = RiwayatSewa::create([
                'id_user' => $user->id,
                'id_kamar' => $kamar->id_kamar,
                'tanggal_masuk' => $activeStart->toDateString(),
                'tanggal_keluar' => $activeEnd->toDateString(),
                'harga_deal' => $kamar->harga_bulanan * $totalDuration,
                'durasi_sewa_bulan' => $totalDuration,
                'status_sewa' => 'aktif',
            ]);
            $this->activeRentals[] = $sewaAktif;

            $invCodeNum = str_pad((string)$this->initialInvoiceCounter++, 3, '0', STR_PAD_LEFT);
            $initialTagihan = Tagihan::create([
                'id_sewa' => $sewaAktif->id_sewa,
                'kode_invoice' => "INV-INITIAL-$invCodeNum",
                'tanggal_tagihan' => $activeStart->toDateString(),
                'tanggal_jatuh_tempo' => $activeStart->toDateString(),
                'total_tagihan' => $kamar->harga_bulanan * $baseDuration,
                'status_tagihan' => 'lunas',
            ]);

            Pembayaran::create([
                'id_tagihan' => $initialTagihan->id_tagihan,
                'tanggal_bayar' => $activeStart->toDateString(),
                'jumlah_bayar' => $initialTagihan->total_tagihan,
                'metode_pembayaran' => 'Transfer Bank',
                'bukti_bayar' => $proofImagePath,
                'status_verifikasi' => 'diterima',
            ]);

            if ($hasExtension) {
                $statusTagihan = 'belum_bayar';
                $statusVerifikasi = null;
                $tglTagihan = $originalEnd->copy()->subDays(5);

                // Clamp invoice date to today or earlier
                if ($tglTagihan->gt($this->baseDate)) {
                    $tglTagihan = $this->baseDate->copy()->subDays(1);
                }

                $jatuhTempo = $originalEnd->copy();
                $tglBayar = null;

                if ($extType === 0) { // accepted
                    $statusTagihan = 'lunas';
                    $statusVerifikasi = 'diterima';
                    $tglBayar = $tglTagihan->copy();
                    $this->extStats['accepted']++;
                } elseif ($extType === 1) { // pending
                    $statusVerifikasi = 'pending';
                    $tglBayar = $tglTagihan->copy();
                    $this->extStats['pending']++;
                } elseif ($extType === 2) { // rejected
                    $statusVerifikasi = 'ditolak';
                    $tglBayar = $tglTagihan->copy();
                    $this->extStats['rejected']++;
                } elseif ($extType === 3) { // unpaid not due
                    $jatuhTempo = $this->baseDate->copy()->addDays(5);
                    $tglTagihan = $this->baseDate->copy()->subDays(1);
                    $this->extStats['unpaid_not_due']++;
                } elseif ($extType === 4) { // overdue
                    $statusTagihan = 'telat';
                    $jatuhTempo = $this->baseDate->copy()->subDays(2);
                    $tglTagihan = $jatuhTempo->copy()->subDays(5);
                    $this->extStats['overdue']++;
                }

                if ($tglTagihan->gt($jatuhTempo)) {
                    $tglTagihan = $jatuhTempo->copy();
                }

                $extCodeNum = str_pad((string)$this->extInvoiceCounter++, 3, '0', STR_PAD_LEFT);
                $extTagihan = Tagihan::create([
                    'id_sewa' => $sewaAktif->id_sewa,
                    'kode_invoice' => "INV-EXT-$extCodeNum",
                    'tanggal_tagihan' => $tglTagihan->toDateString(),
                    'tanggal_jatuh_tempo' => $jatuhTempo->toDateString(),
                    'total_tagihan' => $kamar->harga_bulanan * $extDuration,
                    'status_tagihan' => $statusTagihan,
                ]);

                if ($statusVerifikasi !== null) {
                    Pembayaran::create([
                        'id_tagihan' => $extTagihan->id_tagihan,
                        'tanggal_bayar' => $tglBayar->toDateString(),
                        'jumlah_bayar' => $extTagihan->total_tagihan,
                        'metode_pembayaran' => 'Transfer Bank',
                        'bukti_bayar' => $proofImagePath,
                        'status_verifikasi' => $statusVerifikasi,
                    ]);
                }
            }

            // Historical Rentals for this room
            $lastEnd = $activeStart->copy()->subDays(5);
            for ($tNum = 31; $tNum <= 100; $tNum++) {
                if ((($tNum - 31) % 30) + 1 === $room) {
                    $histUser = $this->tenants[$tNum];
                    $histDur = ($tNum % 4) + 1;
                    $histEnd = $lastEnd->copy();
                    $histStart = $histEnd->copy()->subMonths($histDur);

                    $sewaHist = RiwayatSewa::create([
                        'id_user' => $histUser->id,
                        'id_kamar' => $kamar->id_kamar,
                        'tanggal_masuk' => $histStart->toDateString(),
                        'tanggal_keluar' => $histEnd->toDateString(),
                        'harga_deal' => $kamar->harga_bulanan * $histDur,
                        'durasi_sewa_bulan' => $histDur,
                        'status_sewa' => 'selesai',
                    ]);
                    $this->completedRentals[] = $sewaHist;

                    $invCodeNum = str_pad((string)$this->initialInvoiceCounter++, 3, '0', STR_PAD_LEFT);
                    $ht = Tagihan::create([
                        'id_sewa' => $sewaHist->id_sewa,
                        'kode_invoice' => "INV-INITIAL-$invCodeNum",
                        'tanggal_tagihan' => $histStart->toDateString(),
                        'tanggal_jatuh_tempo' => $histStart->toDateString(),
                        'total_tagihan' => $sewaHist->harga_deal,
                        'status_tagihan' => 'lunas',
                    ]);

                    Pembayaran::create([
                        'id_tagihan' => $ht->id_tagihan,
                        'tanggal_bayar' => $histStart->toDateString(),
                        'jumlah_bayar' => $ht->total_tagihan,
                        'metode_pembayaran' => 'Transfer Bank',
                        'bukti_bayar' => $proofImagePath,
                        'status_verifikasi' => 'diterima',
                    ]);

                    $lastEnd = $histStart->copy()->subDays(5);
                }
            }
        }
    }

    protected function seedPerformanceInvoices(): void
    {
        $eligibleInvoiceCount = Pembayaran::query()
            ->where('status_verifikasi', 'diterima')
            ->whereHas('tagihan', function ($query) {
                $query->where('status_tagihan', 'lunas');
            })
            ->count();

        $remaining = max(
            0,
            self::PERFORMANCE_INVOICE_TARGET - $eligibleInvoiceCount
        );

        if ($remaining === 0) {
            return;
        }

        $rentals = array_values(array_merge(
            $this->activeRentals,
            $this->completedRentals
        ));

        if (empty($rentals)) {
            throw new \RuntimeException(
                'Cannot create performance invoices without rentals.'
            );
        }

        $proofImagePath = $this->publishedPaths['tagihan'] ?? null;
        $rentalCount = count($rentals);

        for ($i = 1; $i <= $remaining; $i++) {
            $rental = $rentals[($i - 1) % $rentalCount];

            $rentalStart = Carbon::parse(
                $rental->tanggal_masuk
            )->startOfDay();

            $rentalEnd = Carbon::parse(
                $rental->tanggal_keluar
            )->startOfDay();

            if ($rentalEnd->gt($this->baseDate)) {
                $rentalEnd = $this->baseDate->copy();
            }

            if ($rentalStart->gt($rentalEnd)) {
                $invoiceDate = $this->baseDate
                    ->copy()
                    ->subDays(($i - 1) % 365);
            } else {
                $dayRange = (int) $rentalStart->diffInDays(
                    $rentalEnd
                );

                $dayOffset = $dayRange === 0
                    ? 0
                    : ($i - 1) % ($dayRange + 1);

                $invoiceDate = $rentalStart
                    ->copy()
                    ->addDays($dayOffset);
            }

            $duration = max(
                1,
                (int) $rental->durasi_sewa_bulan
            );

            $monthlyAmount = round(
                (float) $rental->harga_deal / $duration,
                2
            );

            $codeNumber = str_pad(
                (string) $i,
                4,
                '0',
                STR_PAD_LEFT
            );

            $tagihan = Tagihan::create([
                'id_sewa' => $rental->id_sewa,
                'kode_invoice' => "INV-PERF-$codeNumber",
                'tanggal_tagihan' => $invoiceDate->toDateString(),
                'tanggal_jatuh_tempo' => $invoiceDate->toDateString(),
                'total_tagihan' => $monthlyAmount,
                'status_tagihan' => 'lunas',
            ]);

            Pembayaran::create([
                'id_tagihan' => $tagihan->id_tagihan,
                'tanggal_bayar' => $invoiceDate->toDateString(),
                'jumlah_bayar' => $monthlyAmount,
                'metode_pembayaran' => 'Transfer Bank',
                'bukti_bayar' => $proofImagePath,
                'status_verifikasi' => 'diterima',
            ]);

            $this->performanceInvoiceCount++;
        }
    }

    protected function seedComplaints(): void
    {
        $comp1 = $this->publishedPaths['keluhan_1'] ?? null;
        $comp2 = $this->publishedPaths['keluhan_2'] ?? null;

        $configs = [];
        for ($i = 0; $i < 40; $i++) {
            $configs[] = ['type' => 'selesai', 'photo' => ($i < 28), 'sewa' => $this->completedRentals[$i % count($this->completedRentals)]];
        }
        for ($i = 0; $i < 20; $i++) {
            $configs[] = ['type' => 'pending', 'photo' => ($i < 14), 'sewa' => $this->activeRentals[$i % count($this->activeRentals)]];
        }
        for ($i = 0; $i < 20; $i++) {
            $configs[] = ['type' => 'proses', 'photo' => ($i < 14), 'sewa' => $this->activeRentals[$i % count($this->activeRentals)]];
        }

        foreach ($configs as $idx => $c) {
            $sewa = $c['sewa'];
            $status = $c['type'];

            $foto = null;
            if ($c['photo']) {
                $foto = ($idx % 2 === 0 && $comp2) ? $comp2 : $comp1;
                $this->compStats['with_photo']++;
            } else {
                $this->compStats['without_photo']++;
            }

            $this->compStats[$status]++;

            $tglMasuk = Carbon::parse($sewa->tanggal_masuk);
            $tglKeluar = Carbon::parse($sewa->tanggal_keluar);
            $tglLapor = $tglMasuk->copy()->addDays(($idx % 10) + 1);
            if ($tglLapor->gt($tglKeluar)) {
                $tglLapor = $tglMasuk->copy();
            }

            $tglSelesai = null;
            if ($status === 'selesai') {
                $tglSelesai = $tglLapor->copy()->addDays(2);
                if ($tglSelesai->gt($tglKeluar)) {
                    $tglSelesai = $tglKeluar->copy();
                }
            }

            Keluhan::create([
                'id_sewa' => $sewa->id_sewa,
                'judul_keluhan' => 'Kerusakan ' . ($idx + 1),
                'deskripsi_keluhan' => 'Terdapat kerusakan.',
                'foto_kerusakan' => $foto,
                'status_keluhan' => $status,
                'tanggal_lapor' => $tglLapor->toDateTimeString(),
                'tanggal_selesai' => $tglSelesai?->toDateTimeString(),
            ]);
        }
    }

    protected function seedGuestBook(): void
    {
        $allRentals = array_merge($this->activeRentals, $this->completedRentals);

        for ($i = 0; $i < 150; $i++) {
            $sewa = $allRentals[$i % count($allRentals)];
            $tglMasuk = Carbon::parse($sewa->tanggal_masuk);
            $tglKeluar = Carbon::parse($sewa->tanggal_keluar);

            $waktu = $tglMasuk->copy()->addDays(($i % 15) + 1);
            if ($waktu->gt($tglKeluar) || $waktu->gt($this->baseDate)) {
                $waktu = $tglMasuk->copy()->addDays(1);
                if ($waktu->gt($this->baseDate)) {
                    $waktu = $this->baseDate->copy()->subDays(1);
                }
            }

            if ($i < 5) {
                $waktu = $this->baseDate->copy();
            }

            BukuTamu::create([
                'nama_tamu' => 'Tamu ' . ($i + 1),
                'no_hp_tamu' => '089' . str_pad((string)($i + 1), 9, '2', STR_PAD_LEFT),
                'bertemu_dengan' => $sewa->id_user,
                'keperluan' => 'Berkunjung',
                'waktu_berkunjung' => $waktu->toDateTimeString(),
            ]);
        }
    }

    protected function seedExpenses(): void
    {
        $admin = User::where('role', 'admin')->first();
        if (!$admin) return;

        $categories = ['listrik', 'air', 'internet', 'kebersihan', 'perbaikan', 'perlengkapan'];

        for ($m = 0; $m <= 11; $m++) {
            for ($i = 1; $i <= 6; $i++) {
                $date = $this->baseDate->copy()->subMonths($m)->startOfMonth()->addDays($i);
                $cat = $categories[$i - 1];

                Pengeluaran::create([
                    'judul_pengeluaran' => 'Biaya ' . ucfirst($cat),
                    'deskripsi' => 'Pengeluaran rutin untuk ' . $cat,
                    'jumlah_pengeluaran' => 50000 + (($i % 10) * 10000),
                    'tanggal_pengeluaran' => $date->toDateString(),
                    'bukti_foto' => null,
                    'dibuat_oleh' => $admin->id,
                ]);
            }
        }
    }

    protected function runAssertions(): void
    {
        if (Kamar::count() !== 40) throw new \Exception("Assert failed: Kamar count is not 40");
        if (User::where('role', 'penyewa')->count() !== 100) throw new \Exception("Assert failed: Penyewa count is not 100");
        if (RiwayatSewa::count() !== 100) throw new \Exception("Assert failed: RiwayatSewa count is not 100");
        if (RiwayatSewa::where('status_sewa', 'aktif')->count() !== 30) throw new \Exception("Assert failed: Aktif rentals not 30");
        if (RiwayatSewa::where('status_sewa', 'selesai')->count() !== 70) throw new \Exception("Assert failed: Selesai rentals not 70");
        if (Kamar::where('status_kamar', 'terisi')->count() !== 30) throw new \Exception("Assert failed: Terisi kamar not 30");
        if (Kamar::where('status_kamar', 'tersedia')->count() !== 10) throw new \Exception("Assert failed: Tersedia kamar not 10");

        $terisi = Kamar::where('status_kamar', 'terisi')->get();
        foreach ($terisi as $k) {
            $aktifCount = RiwayatSewa::where('id_kamar', $k->id_kamar)->where('status_sewa', 'aktif')->count();
            if ($aktifCount !== 1) throw new \Exception("Assert failed: Occupied room does not have exactly 1 active rental.");
        }

        $tersedia = Kamar::where('status_kamar', 'tersedia')->get();
        foreach ($tersedia as $k) {
            $aktifCount = RiwayatSewa::where('id_kamar', $k->id_kamar)->where('status_sewa', 'aktif')->count();
            if ($aktifCount !== 0) throw new \Exception("Assert failed: Available room has active rental.");
        }

        $rooms = RiwayatSewa::select('id_kamar', 'tanggal_masuk', 'tanggal_keluar')
            ->orderBy('id_kamar')
            ->orderBy('tanggal_masuk')
            ->get()
            ->groupBy('id_kamar');

        foreach ($rooms as $roomId => $rentals) {
            $lastKeluar = null;
            foreach ($rentals as $r) {
                if ($lastKeluar && Carbon::parse($r->tanggal_masuk)->lt(Carbon::parse($lastKeluar))) {
                    throw new \Exception("Assert failed: Overlapping rentals in room $roomId");
                }
                $lastKeluar = $r->tanggal_keluar;
            }
        }

        $initialInvoices = Tagihan::where('kode_invoice', 'like', 'INV-INITIAL-%')->get();
        if ($initialInvoices->count() !== 100) throw new \Exception("Assert failed: Initial invoices count is not 100");

        foreach ($initialInvoices as $inv) {
            $payments = Pembayaran::where('id_tagihan', $inv->id_tagihan)->where('status_verifikasi', 'diterima')->get();
            if ($payments->count() !== 1) throw new \Exception("Assert failed: Initial invoice payment mismatch");
            if ((float)$payments->first()->jumlah_bayar !== (float)$inv->total_tagihan) throw new \Exception("Assert failed: Amount mismatch");
        }

        $tagihans = Tagihan::all();
        foreach ($tagihans as $tag) {
            if (Carbon::parse($tag->tanggal_tagihan)->gt(Carbon::parse($tag->tanggal_jatuh_tempo))) {
                throw new \Exception("Assert failed: tanggal_tagihan > tanggal_jatuh_tempo for {$tag->kode_invoice}");
            }
            if (Carbon::parse($tag->tanggal_tagihan)->gt($this->baseDate)) {
                throw new \Exception("Assert failed: tanggal_tagihan is in future for {$tag->kode_invoice}");
            }
        }

        $pembayarans = Pembayaran::all();
        foreach ($pembayarans as $pem) {
            if (Carbon::parse($pem->tanggal_bayar)->gt($this->baseDate)) {
                throw new \Exception("Assert failed: tanggal_bayar is in future for {$pem->id_pembayaran}");
            }
        }

        $currentAdmins = User::where('role', 'admin')->get();
        if ($currentAdmins->count() !== $this->adminCountPreflight) {
            throw new \Exception("Assert failed: Admin count changed.");
        }
        foreach ($currentAdmins as $admin) {
            if (!in_array($admin->id, $this->preflightAdminIds) || $this->preflightAdminHashes[$admin->id] !== $admin->password) {
                throw new \Exception("Assert failed: Admin ID or password changed.");
            }
        }

        if (Visitor::count() !== $this->visitorCountPreflight) {
            throw new \Exception("Assert failed: Visitor count changed.");
        }

        if (User::where('role', 'penyewa')->distinct('email')->count() !== 100) throw new \Exception("Assert failed: Emails not unique");

        if (Kamar::distinct('nomor_kamar')->count() !== 40) throw new \Exception("Assert failed: Kamar numbers not unique");
        $uniqueInvoiceCodeCount = Tagihan::query()
            ->distinct()
            ->count('kode_invoice');

        if ($uniqueInvoiceCodeCount !== Tagihan::count()) {
            throw new \Exception(
                'Assert failed: Invoice codes not unique.'
            );
        }

        $eligibleInvoiceCount = Pembayaran::query()
            ->where('status_verifikasi', 'diterima')
            ->whereHas('tagihan', function ($query) {
                $query->where('status_tagihan', 'lunas');
            })
            ->count();

        if (
            $eligibleInvoiceCount
            !== self::PERFORMANCE_INVOICE_TARGET
        ) {
            throw new \Exception(
                'Assert failed: Eligible invoice count is '
                    . $eligibleInvoiceCount
                    . ', expected '
                    . self::PERFORMANCE_INVOICE_TARGET
                    . '.'
            );
        }

        $performanceInvoiceCount = Tagihan::query()
            ->where('kode_invoice', 'like', 'INV-PERF-%')
            ->count();

        if (
            $performanceInvoiceCount
            !== $this->performanceInvoiceCount
        ) {
            throw new \Exception(
                'Assert failed: Performance invoice count mismatch.'
            );
        }

        if (BukuTamu::count() !== 150) throw new \Exception("Assert failed: Guest book count not 150");
        if (Pengeluaran::count() !== 72) throw new \Exception("Assert failed: Expenses count not 72");

        $months = [];
        foreach (Pengeluaran::all() as $p) {
            $months[Carbon::parse($p->tanggal_pengeluaran)->format('Y-m')] = 1;
        }
        if (count($months) !== 12) throw new \Exception("Assert failed: Pengeluaran not covering exactly 12 months.");

        $publicDisk = Storage::disk('public');
        foreach ($this->publishedPaths as $path) {
            if (!$publicDisk->exists($path)) {
                throw new \Exception("Assert failed: Asset path $path missing.");
            }
        }
    }

    protected function printSummary(): void
    {
        echo "---- Corrected Integrated Workflow Demo Seeder Summary ----\n";
        echo "Admins: " . User::where('role', 'admin')->count() . "\n";
        echo "Visitors: " . Visitor::count() . "\n";
        echo "Tenant Users: " . User::where('role', 'penyewa')->count() . "\n";
        echo "Rooms (Terisi): " . Kamar::where('status_kamar', 'terisi')->count() . "\n";
        echo "Rooms (Tersedia): " . Kamar::where('status_kamar', 'tersedia')->count() . "\n";
        echo "Rentals (Aktif): " . RiwayatSewa::where('status_sewa', 'aktif')->count() . "\n";
        echo "Rentals (Selesai): " . RiwayatSewa::where('status_sewa', 'selesai')->count() . "\n";
        echo "Initial Invoices: " . Tagihan::where('kode_invoice', 'like', 'INV-INITIAL-%')->count() . "\n";
        echo "Extension Invoices (Total): 20\n";
        echo "  - Accepted: {$this->extStats['accepted']}\n";
        echo "  - Pending: {$this->extStats['pending']}\n";
        echo "  - Rejected: {$this->extStats['rejected']}\n";
        echo "  - Unpaid (not due): {$this->extStats['unpaid_not_due']}\n";
        echo "  - Overdue: {$this->extStats['overdue']}\n";
        echo "Payments: " . Pembayaran::count() . "\n";
        echo "Complaints (Total): " . Keluhan::count() . "\n";
        echo "  - Pending: {$this->compStats['pending']}\n";
        echo "  - Proses: {$this->compStats['proses']}\n";
        echo "  - Selesai: {$this->compStats['selesai']}\n";
        echo "  - With Photo: {$this->compStats['with_photo']}\n";
        echo "  - Without Photo: {$this->compStats['without_photo']}\n";
        echo "Guest Book Entries: " . BukuTamu::count() . "\n";
        echo "Expenses: " . Pengeluaran::count() . "\n";

        echo "Performance Invoices: "
            . Tagihan::where(
                'kode_invoice',
                'like',
                'INV-PERF-%'
            )->count()
            . "\n";

        echo "Eligible Invoice API Records: "
            . Pembayaran::query()
            ->where('status_verifikasi', 'diterima')
            ->whereHas('tagihan', function ($query) {
                $query->where('status_tagihan', 'lunas');
            })
            ->count()
            . "\n";
    }
}
