<?php

namespace App\Features\Notifications\Patterns\Strategy;

use App\Models\Tagihan;

interface NotificationStrategyInterface
{
    public function generate(Tagihan $tagihan): array;
}
