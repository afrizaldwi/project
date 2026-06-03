<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsurePenyewaHasActiveSewa
{
    public function handle(Request $request, Closure $next): mixed
    {
        $user = $request->user();

        if (
            $user?->role === 'penyewa' &&
            ! $user->riwayatSewa()->where('status_sewa', 'aktif')->exists()
        ) {
            return response()->json([
                'message' => 'Akun penyewa sudah tidak aktif.',
            ], 403);
        }

        return $next($request);
    }
}
