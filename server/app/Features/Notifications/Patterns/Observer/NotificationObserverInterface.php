<?php

namespace App\Features\Notifications\Patterns\Observer;

use App\Models\Tagihan;

interface NotificationObserverInterface
{
    public function update(Tagihan $tagihan, array $warning): void;
}
