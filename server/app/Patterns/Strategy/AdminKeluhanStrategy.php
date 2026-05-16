<?php

namespace App\Patterns\Strategy;

use App\Models\Keluhan;
use Illuminate\Database\Eloquent\Builder;

class AdminKeluhanStrategy implements KeluhanQueryStrategy
{
    public function buildQuery(?int $id_user): Builder
    {
        // Admin sees all reports, no filtering by id_user
        return Keluhan::with(['riwayatSewa.user', 'riwayatSewa.kamar']);
    }
}
