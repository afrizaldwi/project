<?php

namespace App\Patterns\Strategy;

use App\Models\Tagihan;

interface NotificationStrategyInterface
{
    public function generate(Tagihan $tagihan): array;
}
