<?php

namespace App\Services;

use App\Models\Notifikasi;
use App\Models\Tagihan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use App\Models\Pembayaran;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TagihanReminderService
{
    public function __construct(
        private WhatsAppMessageService $whatsAppMessageService,
        private FcmPushNotificationService $fcmPushNotificationService
    ) {}

    private function refreshNotification(
        int $userId,
        Tagihan $tagihan,
        string $tipe,
        string $roleTarget,
        string $judul,
        string $pesan
    ): int {
        $today = now()->toDateString();

        $notifikasi = Notifikasi::firstOrNew([
            'id_user' => $userId,
            'id_tagihan' => $tagihan->id_tagihan,
            'tipe' => $tipe,
        ]);

        if (
            $notifikasi->exists &&
            $notifikasi->last_reminded_at?->toDateString() === $today
        ) {
            return 0;
        }

        $notifikasi->fill([
            'role_target' => $roleTarget,
            'judul' => $judul,
            'pesan' => $pesan,
            'is_read' => false,
            'read_at' => null,
            'last_reminded_at' => $today,
            'reminder_count' => ($notifikasi->reminder_count ?? 0) + 1,
        ]);

        $notifikasi->save();

        $this->fcmPushNotificationService->sendToUser($userId, $notifikasi);

        return 1;
    }

    public function createPenyewaNotificationDirect(Tagihan $tagihan, array $warning): int
    {
        return $this->createPenyewaNotification($tagihan, $warning);
    }

    public function createAdminNotificationsDirect(Tagihan $tagihan, array $warning): int
    {
        return $this->createAdminNotifications($tagihan, $warning);
    }

    public function checkAndCreateNotifications(): int
    {
        $tagihanList = Tagihan::with(['riwayatSewa.user', 'riwayatSewa.kamar'])
            ->whereNotIn('status_tagihan', ['lunas', 'dibayar'])
            ->whereDate('tanggal_jatuh_tempo', '<=', now()->copy()->addDays(7)->toDateString())
            ->get();

        // Instantiate the Subject (Observer pattern)
        $subject = new \App\Patterns\Observer\DueCheckSubject();

        // Attach system observer strictly for warning notifications on the system
        $systemObserver = new \App\Patterns\Observer\SystemNotificationObserver($this);
        $subject->attach($systemObserver);

        foreach ($tagihanList as $tagihan) {
            $warning = $this->calculateWarning($tagihan);

            if (! $warning['aktif']) {
                continue;
            }

            // Notify observer
            $subject->notify($tagihan, $warning);
        }

        return $systemObserver->getCreatedCount();
    }

    public function getAdminTagihan(): Collection
    {
        return Tagihan::with(['riwayatSewa.user', 'riwayatSewa.kamar', 'pembayaran'])
            ->orderByDesc('tanggal_jatuh_tempo')
            ->get()
            ->map(fn(Tagihan $tagihan) => $this->formatTagihan($tagihan));
    }

    public function getPenyewaTagihan(int $userId): Collection
    {
        return Tagihan::with(['riwayatSewa.user', 'riwayatSewa.kamar', 'pembayaran'])
            ->whereHas('riwayatSewa', function ($query) use ($userId) {
                $query->where('id_user', $userId);
            })
            ->orderByDesc('tanggal_jatuh_tempo')
            ->get()
            ->map(fn(Tagihan $tagihan) => $this->formatTagihan($tagihan));
    }

    public function getWhatsAppMessage(int $idTagihan): array
    {
        $tagihan = Tagihan::with(['riwayatSewa.user', 'riwayatSewa.kamar'])
            ->findOrFail($idTagihan);

        return $this->whatsAppMessageService->generate($tagihan);
    }

    public function uploadPaymentProof(
        int $userId,
        int $idTagihan,
        string $metodePembayaran,
        UploadedFile $buktiBayar
    ): array {
        return DB::transaction(function () use ($userId, $idTagihan, $metodePembayaran, $buktiBayar) {
            $tagihan = Tagihan::with(['riwayatSewa.user', 'riwayatSewa.kamar', 'pembayaran'])
                ->where('id_tagihan', $idTagihan)
                ->whereHas('riwayatSewa', function ($query) use ($userId) {
                    $query->where('id_user', $userId);
                })
                ->lockForUpdate()
                ->firstOrFail();

            abort_if(
                $tagihan->status_tagihan === 'lunas',
                422,
                'Tagihan ini sudah lunas.'
            );

            $hasPendingPayment = Pembayaran::where('id_tagihan', $tagihan->id_tagihan)
                ->where('status_verifikasi', 'pending')
                ->exists();

            abort_if(
                $hasPendingPayment,
                422,
                'Bukti pembayaran sebelumnya masih menunggu verifikasi admin.'
            );

            $path = $buktiBayar->store('bukti-pembayaran', 'public');

            Pembayaran::create([
                'id_tagihan' => $tagihan->id_tagihan,
                'tanggal_bayar' => now()->toDateString(),
                'jumlah_bayar' => $tagihan->total_tagihan,
                'metode_pembayaran' => $metodePembayaran,
                'bukti_bayar' => $path,
                'status_verifikasi' => 'pending',
                'catatan_admin' => null,
            ]);

            $tagihan->refresh();
            $tagihan->load(['riwayatSewa.user', 'riwayatSewa.kamar', 'pembayaran']);

            return $this->formatTagihan($tagihan);
        });
    }

    public function getPendingPayments(): Collection
    {
        return Pembayaran::with(['tagihan.riwayatSewa.user', 'tagihan.riwayatSewa.kamar'])
            ->where('status_verifikasi', 'pending')
            ->latest('tanggal_bayar')
            ->get()
            ->map(fn(Pembayaran $pembayaran) => $this->formatPembayaran($pembayaran));
    }

    public function verifyPayment(int $idPembayaran, ?string $catatanAdmin = null): array
    {
        return DB::transaction(function () use ($idPembayaran, $catatanAdmin) {
            $pembayaran = Pembayaran::with('tagihan')
                ->where('id_pembayaran', $idPembayaran)
                ->lockForUpdate()
                ->firstOrFail();

            // Delegate state transition logic to PaymentContext (State pattern)
            $context = new \App\Patterns\State\PaymentContext($pembayaran);
            $context->verify($pembayaran, $catatanAdmin);

            $pembayaran->refresh();
            $pembayaran->load(['tagihan.riwayatSewa.user', 'tagihan.riwayatSewa.kamar']);

            return $this->formatPembayaran($pembayaran);
        });
    }

    public function rejectPayment(int $idPembayaran, ?string $catatanAdmin = null): array
    {
        return DB::transaction(function () use ($idPembayaran, $catatanAdmin) {
            $pembayaran = Pembayaran::with('tagihan')
                ->where('id_pembayaran', $idPembayaran)
                ->lockForUpdate()
                ->firstOrFail();

            // Delegate state transition logic to PaymentContext (State pattern)
            $context = new \App\Patterns\State\PaymentContext($pembayaran);
            $context->reject($pembayaran, $catatanAdmin);

            $pembayaran->refresh();
            $pembayaran->load(['tagihan.riwayatSewa.user', 'tagihan.riwayatSewa.kamar']);

            return $this->formatPembayaran($pembayaran);
        });
    }

    public function getUserNotifications(int $userId, bool $onlyUnread = false): Collection
    {
        $query = Notifikasi::with(['tagihan.riwayatSewa.user', 'tagihan.riwayatSewa.kamar'])
            ->where('id_user', $userId)
            ->orderByDesc('last_reminded_at')
            ->orderByDesc('updated_at');

        if ($onlyUnread) {
            $query->where('is_read', false)
                ->whereHas('tagihan', function ($query) {
                    $query->whereNotIn('status_tagihan', ['lunas', 'dibayar']);
                });
        }

        return $query->get()->map(function (Notifikasi $notifikasi) {
            return [
                'id' => $notifikasi->id,
                'id_tagihan' => $notifikasi->id_tagihan,
                'role_target' => $notifikasi->role_target,
                'tipe' => $notifikasi->tipe,
                'judul' => $notifikasi->judul,
                'pesan' => $notifikasi->pesan,
                'is_read' => $notifikasi->is_read,
                'last_reminded_at' => $notifikasi->last_reminded_at,
                'reminder_count' => $notifikasi->reminder_count,
                'created_at' => $notifikasi->created_at,
                'tagihan' => $notifikasi->tagihan
                    ? $this->formatTagihan($notifikasi->tagihan)
                    : null,
            ];
        });
    }

    public function markAsRead(int $userId, int $idNotifikasi): array
    {
        $notifikasi = Notifikasi::where('id', $idNotifikasi)
            ->where('id_user', $userId)
            ->firstOrFail();

        $notifikasi->is_read = true;
        $notifikasi->read_at = now();
        $notifikasi->save();

        return [
            'message' => 'Notifikasi berhasil ditandai sebagai dibaca.',
        ];
    }

    public function calculateWarning(Tagihan $tagihan): array
    {
        if (in_array($tagihan->status_tagihan, ['lunas', 'dibayar'], true)) {
            return [
                'aktif' => false,
                'status' => null,
                'hari_tersisa' => null,
                'judul' => null,
                'pesan' => null,
            ];
        }

        $dueDate = Carbon::parse($tagihan->tanggal_jatuh_tempo)->startOfDay();
        $today = now()->startOfDay();

        $hariTersisa = $today->diffInDays($dueDate, false);

        if ($hariTersisa > 7) {
            return [
                'aktif' => false,
                'status' => null,
                'hari_tersisa' => $hariTersisa,
                'judul' => null,
                'pesan' => null,
            ];
        }

        if ($hariTersisa >= 0) {
            return [
                'aktif' => true,
                'status' => 'akan_jatuh_tempo',
                'hari_tersisa' => $hariTersisa,
                'judul' => 'Tagihan akan jatuh tempo',
                'pesan' => "Tagihan akan jatuh tempo dalam {$hariTersisa} hari.",
            ];
        }

        return [
            'aktif' => true,
            'status' => 'terlambat',
            'hari_tersisa' => $hariTersisa,
            'judul' => 'Tagihan terlambat',
            'pesan' => 'Tagihan sudah melewati tanggal jatuh tempo.',
        ];
    }

    private function createPenyewaNotification(Tagihan $tagihan, array $warning): int
    {
        $user = $tagihan->riwayatSewa?->user;

        if (! $user) {
            return 0;
        }

        return $this->refreshNotification(
            userId: $user->id,
            tagihan: $tagihan,
            tipe: 'tagihan_reminder',
            roleTarget: 'penyewa',
            judul: $warning['judul'],
            pesan: $warning['pesan']
        );
    }

    private function createAdminNotifications(Tagihan $tagihan, array $warning): int
    {
        $admins = User::where('role', 'admin')->get();
        $processedCount = 0;

        foreach ($admins as $admin) {
            $tenantName = $tagihan->riwayatSewa?->user?->nama_lengkap ?? 'Penyewa';
            $roomNumber = $tagihan->riwayatSewa?->kamar?->nomor_kamar ?? '-';

            $processedCount += $this->refreshNotification(
                userId: $admin->id,
                tagihan: $tagihan,
                tipe: 'admin_tagihan_reminder',
                roleTarget: 'admin',
                judul: $warning['judul'],
                pesan: "{$tenantName} kamar {$roomNumber}: {$warning['pesan']}"
            );
        }

        return $processedCount;
    }

    private function formatPembayaran(Pembayaran $pembayaran): array
    {
        $pembayaran->loadMissing(['tagihan.riwayatSewa.user', 'tagihan.riwayatSewa.kamar']);

        $buktiBayar = $pembayaran->bukti_bayar;

        return [
            'id_pembayaran' => $pembayaran->id_pembayaran,
            'id_tagihan' => $pembayaran->id_tagihan,
            'tanggal_bayar' => $pembayaran->tanggal_bayar,
            'jumlah_bayar' => $pembayaran->jumlah_bayar,
            'metode_pembayaran' => $pembayaran->metode_pembayaran,
            'bukti_bayar' => $buktiBayar,
            'bukti_bayar_url' => $buktiBayar ? url(Storage::url($buktiBayar)) : null,
            'status_verifikasi' => $pembayaran->status_verifikasi,
            'catatan_admin' => $pembayaran->catatan_admin,
            'tagihan' => $pembayaran->tagihan ? $this->formatTagihan($pembayaran->tagihan) : null,
        ];
    }

    private function formatTagihan(Tagihan $tagihan): array
    {
        $tagihan->loadMissing(['riwayatSewa.user', 'riwayatSewa.kamar', 'pembayaran']);

        $warning = $this->calculateWarning($tagihan);
        $whatsapp = $this->whatsAppMessageService->generate($tagihan);

        $latestPayment = $tagihan->pembayaran
            ->sortByDesc('created_at')
            ->first();

        return [
            'id_tagihan' => $tagihan->id_tagihan,
            'id_sewa' => $tagihan->id_sewa,
            'kode_invoice' => $tagihan->kode_invoice,
            'tanggal_tagihan' => $tagihan->tanggal_tagihan,
            'tanggal_jatuh_tempo' => $tagihan->tanggal_jatuh_tempo,
            'total_tagihan' => $tagihan->total_tagihan,
            'status_tagihan' => $tagihan->status_tagihan,

            'pembayaran_terbaru' => $latestPayment ? [
                'id_pembayaran' => $latestPayment->id_pembayaran,
                'tanggal_bayar' => $latestPayment->tanggal_bayar,
                'jumlah_bayar' => $latestPayment->jumlah_bayar,
                'metode_pembayaran' => $latestPayment->metode_pembayaran,
                'bukti_bayar' => $latestPayment->bukti_bayar,
                'bukti_bayar_url' => $latestPayment->bukti_bayar
                    ? url(Storage::url($latestPayment->bukti_bayar))
                    : null,
                'status_verifikasi' => $latestPayment->status_verifikasi,
                'catatan_admin' => $latestPayment->catatan_admin,
            ] : null,

            'penyewa' => [
                'id' => $tagihan->riwayatSewa?->user?->id,
                'nama_lengkap' => $tagihan->riwayatSewa?->user?->nama_lengkap,
                'email' => $tagihan->riwayatSewa?->user?->email,
                'no_hp' => $tagihan->riwayatSewa?->user?->no_hp,
            ],

            'kamar' => [
                'id_kamar' => $tagihan->riwayatSewa?->kamar?->id_kamar,
                'nomor_kamar' => $tagihan->riwayatSewa?->kamar?->nomor_kamar,
            ],

            'peringatan' => $warning,

            'notifikasi' => [
                'aktif' => $warning['aktif'],
                'judul' => $warning['judul'],
                'pesan' => $warning['pesan'],
            ],

            'whatsapp' => [
                ...$whatsapp,
                'enabled' => $warning['aktif'] && $whatsapp['enabled'],
            ],
        ];
    }
}
