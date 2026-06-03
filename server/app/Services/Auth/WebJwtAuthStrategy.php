<?php

namespace App\Services\Auth;

use App\Contracts\Auth\JwtAuthStrategy;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cookie;

class WebJwtAuthStrategy implements JwtAuthStrategy
{
    public function respond(User $user, string $token): JsonResponse
    {
        $cookie = Cookie::make(
            (string) config('jwt.cookie_key_name', 'jwt_token'),
            $token,
            (int) config('jwt.ttl', 60),
            '/',
            null,
            (bool) config('session.secure', false),
            true,
            false,
            config('session.same_site', 'lax') ?: 'lax'
        );

        return response()->json([
            'message' => 'Berhasil masuk',
            'user' => $user,
        ])->withCookie($cookie);
    }
}
