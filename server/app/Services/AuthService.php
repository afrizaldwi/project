<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function login(Request $request): array
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return [
                'success' => false,
                'message' => 'Email atau password salah.',
            ];
        }

        if ($this->isInactivePenyewa($user)) {
            return [
                'success' => false,
                'message' => 'Akun penyewa sudah tidak aktif.',
            ];
        }

        return [
            'success' => true,
            'user' => $user,
            'token' => JWTAuth::fromUser($user),
        ];
    }

    public function logout(Request $request): void
    {
        try {
            JWTAuth::parseToken()->invalidate();
        } catch (JWTException) {
            // Logout should be idempotent even when the token was already invalidated.
        }
    }

    public function refresh(Request $request): array
    {
        $user = $request->user('api');
        $token = JWTAuth::parseToken()->refresh();

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function profile(User $user): User
    {
        return $user;
    }

    private function isInactivePenyewa(User $user): bool
    {
        return $user->role === 'penyewa'
            && ! $user->riwayatSewa()->where('status_sewa', 'aktif')->exists();
    }
}
