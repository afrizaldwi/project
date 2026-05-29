<?php

namespace App\Services\Auth;

use App\Contracts\Auth\JwtAuthStrategy;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class MobileJwtAuthStrategy implements JwtAuthStrategy
{
    public function respond(User $user, string $token): JsonResponse
    {
        return response()->json([
            'message' => 'Login Berhasil',
            'user' => $user,
            'access_token' => $token,
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => (int) config('jwt.ttl', 60) * 60,
        ]);
    }
}
