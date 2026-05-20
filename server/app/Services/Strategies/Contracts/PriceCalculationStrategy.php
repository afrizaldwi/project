<?php

namespace App\Services\Strategies\Contracts;

interface PriceCalculationStrategy
{
    public function calculate(float $basePrice, int $durationMonths): float;
}
