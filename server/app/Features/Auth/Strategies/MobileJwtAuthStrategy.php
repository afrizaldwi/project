<?php

namespace App\Features\Auth\Strategies;

use App\Features\Auth\Contracts\JwtAuthStrategy;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class MobileJwtAuthStrategy implements JwtAuthStrategy
{
    public function respond(User $user, string $token): JsonResponse
    {
        return response()->json([
            'message' => 'Berhasil masuk',
            'user' => $user,
            'access_token' => $token,
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => (int) config('jwt.ttl', 60) * 60,
        ]);
    }
}
