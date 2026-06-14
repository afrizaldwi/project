<?php

namespace App\Features\Sewa\Services;

use App\Features\Sewa\Contracts\DateCalculationStrategy;
use Carbon\Carbon;

class MonthlyRentalCalculation implements DateCalculationStrategy
{
    public function calculate(Carbon $startDate, int $durationMonths): Carbon
    {
        return $startDate->copy()->addMonthsNoOverflow($durationMonths);
    }
}
