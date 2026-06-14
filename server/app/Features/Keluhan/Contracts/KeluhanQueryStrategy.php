<?php

namespace App\Features\Keluhan\Contracts;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

interface KeluhanQueryStrategy
{
    public function query(Request $request): Builder;
}
