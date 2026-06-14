<?php

namespace App\Features\Notifications\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Notifications\Models\MobileDeviceToken;
use App\Features\Notifications\Patterns\Facade\TagihanReminderFacade;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TagihanReminderController extends Controller
{
    public function __construct(
        private TagihanReminderFacade $tagihanReminderFacade
    ) {}

    public function adminTagihan(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $this->validatePagination($request, [
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in(['semua', 'belum_bayar', 'lunas', 'telat', 'dibatalkan'])],
        ]);

        $paginator = $this->tagihanReminderFacade->getAdminTagihanPaginated(
            $this->perPage($request),
            $validated['search'] ?? null,
            $validated['status'] ?? null
        );

        return response()->json([
            'data' => $this->paginatedData($paginator),
            'meta' => $this->paginationMeta($paginator),
            'summary' => $this->tagihanReminderFacade->getAdminTagihanSummary(
                $validated['search'] ?? null,
                $validated['status'] ?? null
            ),
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
        ], [
            'device_token.required' => 'Token perangkat wajib diisi.',
            'platform.max' => 'Platform maksimal 20 karakter.',
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
            'message' => 'Token perangkat berhasil disimpan.',
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
        ], [
            'metode_pembayaran.required' => 'Metode pembayaran wajib dipilih.',
            'metode_pembayaran.max' => 'Metode pembayaran maksimal 50 karakter.',
            'bukti_bayar.required' => 'Bukti pembayaran wajib diunggah.',
            'bukti_bayar.file' => 'Bukti pembayaran harus berupa file.',
            'bukti_bayar.mimes' => 'Bukti pembayaran harus berformat JPG, JPEG, PNG, atau PDF.',
            'bukti_bayar.max' => 'Bukti pembayaran maksimal 5MB.',
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

        $validated = $this->validatePagination($request, [
            'search' => ['nullable', 'string', 'max:100'],
        ]);

        $paginator = $this->tagihanReminderFacade->getPendingPaymentsPaginated(
            $this->perPage($request),
            $validated['search'] ?? null
        );

        return response()->json([
            'data' => $this->paginatedData($paginator),
            'meta' => $this->paginationMeta($paginator),
        ]);
    }

    public function verifyPayment(Request $request, int $idPembayaran): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'catatan_admin' => ['nullable', 'string', 'max:500'],
        ], [
            'catatan_admin.max' => 'Catatan admin maksimal 500 karakter.',
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
        ], [
            'catatan_admin.max' => 'Catatan admin maksimal 500 karakter.',
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
