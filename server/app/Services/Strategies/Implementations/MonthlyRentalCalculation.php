<?php

namespace App\Services\Strategies\Implementations;

use App\Services\Strategies\Contracts\DateCalculationStrategy;
use Carbon\Carbon;

class MonthlyRentalCalculation implements DateCalculationStrategy
{
    public function calculate(Carbon $startDate, int $durationMonths): Carbon
    {
        return $startDate->copy()->addMonthsNoOverflow($durationMonths);
    }
}
