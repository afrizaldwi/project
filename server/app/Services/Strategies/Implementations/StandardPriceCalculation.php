<?php

namespace App\Services\Strategies\Implementations;

use App\Services\Strategies\Contracts\PriceCalculationStrategy;

class StandardPriceCalculation implements PriceCalculationStrategy
{
    public function calculate(float $basePrice, int $durationMonths): float
    {
        return $basePrice * $durationMonths;
    }
}
