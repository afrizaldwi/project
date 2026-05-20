<?php

namespace App\Patterns\Strategy;

use App\Models\Keluhan;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class AdminKeluhanStrategy implements KeluhanQueryStrategy
{
    public function query(Request $request): Builder
    {
        $query = Keluhan::with([
            'riwayatSewa.user',
            'riwayatSewa.kamar',
        ]);

        if ($request->filled('status')) {
            $query->where('status_keluhan', $request->string('status'));
        }

        return $query;
    }
}
