<?php

namespace App\Patterns\Strategy;

use App\Models\Keluhan;
use Illuminate\Database\Eloquent\Builder;

class PenyewaKeluhanStrategy implements KeluhanQueryStrategy
{
    public function buildQuery(?int $id_user): Builder
    {
        $query = Keluhan::with(['riwayatSewa.user', 'riwayatSewa.kamar']);
        
        if ($id_user) {
            $query->whereHas('riwayatSewa', function($q) use ($id_user) {
                $q->where('id_user', $id_user);
            });
        }
        
        return $query;
    }
}
