<?php

namespace App\Features\Keluhan\Services;

use App\Features\Keluhan\Models\Keluhan;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use App\Features\Keluhan\Contracts\KeluhanQueryStrategy;

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

        if ($request->filled('status') && $request->string('status')->toString() !== 'semua') {
            $query->where('status_keluhan', $request->string('status'));
        }

        return $query;
    }
}
