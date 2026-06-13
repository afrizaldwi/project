<?php

namespace App\Patterns\Strategy;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

interface KeluhanQueryStrategy
{
    public function query(Request $request): Builder;
}
