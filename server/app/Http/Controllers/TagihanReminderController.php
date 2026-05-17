<?php

namespace App\Http\Controllers;

use App\Models\MobileDeviceToken;
use App\Services\TagihanReminderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagihanReminderController extends Controller
{
    public function __construct(
        private TagihanReminderService $tagihanReminderService
    ) {}

    public function adminTagihan(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        return response()->json([
            'data' => $this->tagihanReminderService->getAdminTagihan(),
        ]);
    }

    public function penyewaTagihan(Request $request): JsonResponse
    {
        abort_unless($request->user()?->role === 'penyewa', 403, 'Akses hanya untuk penyewa.');

        return response()->json([
            'data' => $this->tagihanReminderService->getPenyewaTagihan($request->user()->id),
        ]);
    }

    public function notifications(Request $request): JsonResponse
    {
        $onlyUnread = $request->boolean('unread');

        return response()->json([
            'data' => $this->tagihanReminderService->getUserNotifications(
                $request->user()->id,
                $onlyUnread
            ),
        ]);
    }

    public function markNotificationAsRead(Request $request, int $idNotifikasi): JsonResponse
    {
        return response()->json(
            $this->tagihanReminderService->markAsRead(
                $request->user()->id,
                $idNotifikasi
            )
        );
    }

    public function whatsappMessage(Request $request, int $idTagihan): JsonResponse
    {
        $this->authorizeAdmin($request);

        return response()->json(
            $this->tagihanReminderService->getWhatsAppMessage($idTagihan)
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

        $createdCount = $this->tagihanReminderService->checkAndCreateNotifications();

        return response()->json([
            'message' => 'Pengecekan jatuh tempo berhasil dijalankan.',
            'created_notifications' => $createdCount,
        ]);
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()?->role === 'admin', 403, 'Akses hanya untuk admin.');
    }
}
