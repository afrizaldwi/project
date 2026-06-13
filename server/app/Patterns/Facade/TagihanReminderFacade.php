<?php

namespace App\Patterns\Facade;

use App\Services\TagihanReminderService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class TagihanReminderFacade
{
    public function __construct(
        private TagihanReminderService $tagihanReminderService
    ) {}

    public function checkAndProcessDueReminders(): int
    {
        return $this->tagihanReminderService->checkAndCreateNotifications();
    }

    public function getWhatsAppReminderData(int $idTagihan): array
    {
        return $this->tagihanReminderService->getWhatsAppMessage($idTagihan);
    }

    public function getAdminTagihan(): Collection
    {
        return $this->tagihanReminderService->getAdminTagihan();
    }

    public function getAdminTagihanPaginated(int $perPage, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        return $this->tagihanReminderService->getAdminTagihanPaginated($perPage, $search, $status);
    }

    public function getAdminTagihanSummary(?string $search = null, ?string $status = null): array
    {
        return $this->tagihanReminderService->getAdminTagihanSummary($search, $status);
    }

    public function getPenyewaTagihan(int $userId): Collection
    {
        return $this->tagihanReminderService->getPenyewaTagihan($userId);
    }

    public function getUserNotifications(int $userId, bool $onlyUnread = false): Collection
    {
        return $this->tagihanReminderService->getUserNotifications($userId, $onlyUnread);
    }

    public function markAsRead(int $userId, int $idNotifikasi): array
    {
        return $this->tagihanReminderService->markAsRead($userId, $idNotifikasi);
    }

    public function uploadPaymentProof(int $userId, int $idTagihan, string $metodePembayaran, $buktiBayar): array
    {
        return $this->tagihanReminderService->uploadPaymentProof($userId, $idTagihan, $metodePembayaran, $buktiBayar);
    }

    public function getPendingPayments(): Collection
    {
        return $this->tagihanReminderService->getPendingPayments();
    }

    public function getPendingPaymentsPaginated(int $perPage, ?string $search = null): LengthAwarePaginator
    {
        return $this->tagihanReminderService->getPendingPaymentsPaginated($perPage, $search);
    }

    public function verifyPayment(int $idPembayaran, ?string $catatanAdmin = null): array
    {
        return $this->tagihanReminderService->verifyPayment($idPembayaran, $catatanAdmin);
    }

    public function rejectPayment(int $idPembayaran, ?string $catatanAdmin = null): array
    {
        return $this->tagihanReminderService->rejectPayment($idPembayaran, $catatanAdmin);
    }
}
