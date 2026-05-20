<?php

namespace App\Patterns\Strategy;

use App\Models\Tagihan;

class NotificationContext
{
    public function __construct(
        private NotificationStrategyInterface $strategy
    ) {}

    public function setStrategy(NotificationStrategyInterface $strategy): void
    {
        $this->strategy = $strategy;
    }

    public function generate(Tagihan $tagihan): array
    {
        return $this->strategy->generate($tagihan);
    }
}
