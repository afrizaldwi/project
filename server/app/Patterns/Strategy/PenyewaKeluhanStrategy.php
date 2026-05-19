<?php

namespace App\Patterns\Strategy;

use App\Models\Keluhan;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class PenyewaKeluhanStrategy implements KeluhanQueryStrategy
{
    public function __construct(private readonly int $userId) {}

    public function query(Request $request): Builder
    {
        $query = Keluhan::with([
            'riwayatSewa.user',
            'riwayatSewa.kamar',
        ])->whereHas('riwayatSewa', function (Builder $query) {
            $query->where('id_user', $this->userId);
        });

        if ($request->filled('status')) {
            $query->where('status_keluhan', $request->string('status'));
        }

        return $query;
    }
}
