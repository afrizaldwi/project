<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

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

        if ($request->hasSession()) {
            Auth::login($user);
            $request->session()->regenerate();
        }

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

    public function profile(User $user): User
    {
        return $user;
    }
}
