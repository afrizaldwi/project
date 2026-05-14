<?php

namespace App\Services;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    public function login(LoginRequest $request): array
    {
        if (!Auth::attempt([
            'email' => $request->email,
            'password' => $request->password,
        ])) {
            return [
                'success' => false,
                'message' => 'Email atau password salah.',
            ];
        }

        $request->session()->regenerate();

        $user = Auth::user();
        $token = $user->createToken('authToken')->plainTextToken;

        return [
            'success' => true,
            'user' => $user,
            'token' => $token,
        ];
    }

    public function logout(Request $request): void
    {
        $user = $request->user();

        if ($user) {
            $token = $user->currentAccessToken();

            if ($token instanceof \Laravel\Sanctum\PersonalAccessToken) {
                $token->delete();
            }
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }

    public function profile(User $user): User
    {
        return $user;
    }
}
