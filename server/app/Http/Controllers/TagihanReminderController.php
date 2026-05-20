<?php

namespace App\Http\Controllers;

use App\Models\MobileDeviceToken;
use App\Patterns\Facade\TagihanReminderFacade;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagihanReminderController extends Controller
{
    public function __construct(
        private TagihanReminderFacade $tagihanReminderFacade
    ) {}

    public function adminTagihan(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        return response()->json([
            'data' => $this->tagihanReminderFacade->getAdminTagihan(),
        ]);
    }

    public function penyewaTagihan(Request $request): JsonResponse
    {
        abort_unless($request->user()?->role === 'penyewa', 403, 'Akses hanya untuk penyewa.');

        return response()->json([
            'data' => $this->tagihanReminderFacade->getPenyewaTagihan($request->user()->id),
        ]);
    }

    public function notifications(Request $request): JsonResponse
    {
        $onlyUnread = $request->boolean('unread');

        return response()->json([
            'data' => $this->tagihanReminderFacade->getUserNotifications(
                $request->user()->id,
                $onlyUnread
            ),
        ]);
    }

    public function markNotificationAsRead(Request $request, int $idNotifikasi): JsonResponse
    {
        return response()->json(
            $this->tagihanReminderFacade->markAsRead(
                $request->user()->id,
                $idNotifikasi
            )
        );
    }

    public function whatsappMessage(Request $request, int $idTagihan): JsonResponse
    {
        $this->authorizeAdmin($request);

        return response()->json(
            $this->tagihanReminderFacade->getWhatsAppReminderData($idTagihan)
        );
    }

    public function registerDeviceToken(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'device_token' => ['required', 'string'],
            'platform' => ['nullable', 'string', 'max:20'],
        ]);

        MobileDeviceToken::updateOrCreate(
            [
                'id_user' => $request->user()->id,
                'device_token' => $validated['device_token'],
            ],
            [
                'platform' => $validated['platform'] ?? 'android',
                'last_used_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Device token berhasil disimpan.',
        ]);
    }

    public function checkDueDate(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $createdCount = $this->tagihanReminderFacade->checkAndProcessDueReminders();

        return response()->json([
            'message' => 'Pengecekan jatuh tempo berhasil dijalankan.',
            'created_notifications' => $createdCount,
        ]);
    }

    public function uploadPaymentProof(Request $request, int $idTagihan): JsonResponse
    {
        abort_unless($request->user()?->role === 'penyewa', 403, 'Akses hanya untuk penyewa.');

        $validated = $request->validate([
            'metode_pembayaran' => ['required', 'string', 'max:50'],
            'bukti_bayar' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        return response()->json([
            'message' => 'Bukti pembayaran berhasil diunggah. Menunggu verifikasi admin.',
            'data' => $this->tagihanReminderFacade->uploadPaymentProof(
                userId: $request->user()->id,
                idTagihan: $idTagihan,
                metodePembayaran: $validated['metode_pembayaran'],
                buktiBayar: $request->file('bukti_bayar')
            ),
        ], 201);
    }

    public function pendingPayments(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        return response()->json([
            'data' => $this->tagihanReminderFacade->getPendingPayments(),
        ]);
    }

    public function verifyPayment(Request $request, int $idPembayaran): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'catatan_admin' => ['nullable', 'string', 'max:500'],
        ]);

        return response()->json([
            'message' => 'Pembayaran berhasil diverifikasi.',
            'data' => $this->tagihanReminderFacade->verifyPayment(
                idPembayaran: $idPembayaran,
                catatanAdmin: $validated['catatan_admin'] ?? null
            ),
        ]);
    }

    public function rejectPayment(Request $request, int $idPembayaran): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'catatan_admin' => ['nullable', 'string', 'max:500'],
        ]);

        return response()->json([
            'message' => 'Pembayaran berhasil ditolak.',
            'data' => $this->tagihanReminderFacade->rejectPayment(
                idPembayaran: $idPembayaran,
                catatanAdmin: $validated['catatan_admin'] ?? null
            ),
        ]);
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()?->role === 'admin', 403, 'Akses hanya untuk admin.');
    }
}
