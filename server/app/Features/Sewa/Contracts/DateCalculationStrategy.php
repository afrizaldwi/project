<?php

namespace App\Features\Sewa\Contracts;

use Carbon\Carbon;

interface DateCalculationStrategy
{
    public function calculate(Carbon $startDate, int $durationMonths): Carbon;
}
