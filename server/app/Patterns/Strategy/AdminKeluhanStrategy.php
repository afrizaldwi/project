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

        if ($request->filled('status') && $request->string('status')->toString() !== 'semua') {
            $query->where('status_keluhan', $request->string('status'));
        }

        $search = trim((string) $request->query('search', ''));

        if ($search !== '') {
            $query->where(function (Builder $query) use ($search) {
                $query->where('judul_keluhan', 'like', "%{$search}%")
                    ->orWhere('deskripsi_keluhan', 'like', "%{$search}%")
                    ->orWhereHas('riwayatSewa.user', function (Builder $userQuery) use ($search) {
                        $userQuery->where('nama_lengkap', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhereHas('riwayatSewa.kamar', function (Builder $kamarQuery) use ($search) {
                        $kamarQuery->where('nomor_kamar', 'like', "%{$search}%");
                    });
            });
        }

        return $query;
    }
}
