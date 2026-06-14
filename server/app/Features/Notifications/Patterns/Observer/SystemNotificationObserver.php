<?php

namespace App\Features\Notifications\Patterns\Observer;

use App\Models\Tagihan;
use App\Features\Notifications\Services\TagihanReminderService;

class SystemNotificationObserver implements NotificationObserverInterface
{
    private int $createdCount = 0;

    public function __construct(
        private TagihanReminderService $service
    ) {}

    public function update(Tagihan $tagihan, array $warning): void
    {
        $this->createdCount += $this->service->createPenyewaNotificationDirect($tagihan, $warning);
        $this->createdCount += $this->service->createAdminNotificationsDirect($tagihan, $warning);
    }

    public function getCreatedCount(): int
    {
        return $this->createdCount;
    }
}
