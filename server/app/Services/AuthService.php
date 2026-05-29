<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;
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

        $user = $request->user();

        if ($user) {
            $token = $user->currentAccessToken();

            if ($token instanceof PersonalAccessToken) {
                $token->delete();
            }
        }

        if ($request->hasSession()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
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
