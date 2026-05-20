<?php

namespace App\Services\Strategies\Contracts;

use Carbon\Carbon;

interface DateCalculationStrategy
{
    public function calculate(Carbon $startDate, int $durationMonths): Carbon;
}
