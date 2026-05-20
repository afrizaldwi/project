<?php

namespace App\Http\Middleware;

use App\Models\RiwayatSewa;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePenyewaHasActiveSewa
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        if ($user->role !== 'penyewa') {
            return $next($request);
        }

        $hasActiveSewa = RiwayatSewa::where('id_user', $user->id)
            ->where('status_sewa', 'aktif')
            ->exists();

        if (! $hasActiveSewa) {
            return response()->json([
                'message' => 'Akun penyewa sudah tidak aktif.',
            ], 403);
        }

        return $next($request);
    }
}
