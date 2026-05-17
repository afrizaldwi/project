<?php

namespace App\Services;

use App\Models\Notifikasi;
use App\Models\Tagihan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

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

    public function checkAndCreateNotifications(): int
    {
        $tagihanList = Tagihan::with(['riwayatSewa.user', 'riwayatSewa.kamar'])
            ->whereNotIn('status_tagihan', ['lunas', 'dibayar'])
            ->whereDate('tanggal_jatuh_tempo', '<=', now()->copy()->addDays(7)->toDateString())
            ->get();

        $createdCount = 0;

        foreach ($tagihanList as $tagihan) {
            $warning = $this->calculateWarning($tagihan);

            if (! $warning['aktif']) {
                continue;
            }

            $createdCount += $this->createPenyewaNotification($tagihan, $warning);
            $createdCount += $this->createAdminNotifications($tagihan, $warning);
        }

        return $createdCount;
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

    private function formatTagihan(Tagihan $tagihan): array
    {
        $tagihan->loadMissing(['riwayatSewa.user', 'riwayatSewa.kamar', 'pembayaran']);

        $warning = $this->calculateWarning($tagihan);
        $whatsapp = $this->whatsAppMessageService->generate($tagihan);

        return [
            'id_tagihan' => $tagihan->id_tagihan,
            'id_sewa' => $tagihan->id_sewa,
            'kode_invoice' => $tagihan->kode_invoice,
            'tanggal_tagihan' => $tagihan->tanggal_tagihan,
            'tanggal_jatuh_tempo' => $tagihan->tanggal_jatuh_tempo,
            'total_tagihan' => $tagihan->total_tagihan,
            'status_tagihan' => $tagihan->status_tagihan,

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
