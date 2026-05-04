<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    public function login(string $email, string $password): array
    {
        if (!Auth::attempt(['email' => $email, 'password' => $password])) {
            return [
                'success' => false,
                'message' => 'Email atau password salah.',
            ];
        }

        $user = Auth::user();
        $token = $user->createToken('authToken')->plainTextToken;

        return [
            'success' => true,
            'user' => $user,
            'token' => $token,
        ];
    }

    public function logout(User $user): void
    {
        $token = $user->currentAccessToken();

        if ($token instanceof \Laravel\Sanctum\PersonalAccessToken) {
            $token->delete();
        }

        Auth::guard('web')->logout();
    }

    public function profile(User $user): User
    {
        return $user;
    }
}
