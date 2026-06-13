<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): mixed
    {
        if ($request->user()?->role !== 'admin') {
            return response()->json([
                'message' => 'Akses hanya untuk admin.',
            ], 403);
        }

        return $next($request);
    }
}
