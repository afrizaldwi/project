<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function login(LoginRequest $req): JsonResponse
    {
        $result = $this->authService->login(
            $req->email,
            $req->password
        );

        if (!$result['success']) {
            return response()->json([
                'message' => $result['message']
            ], 401);
        }

        return response()->json([
            'message' => 'Login Berhasil',
            'token' => $result['token'],
            'user' => $result['user']
        ]);
    }

    public function logout(Request $req): JsonResponse
    {
        $this->authService->logout($req->user());

        return response()->json([
            'message' => 'Logout Berhasil',
        ]);
    }

    public function profile(Request $req): JsonResponse
    {
        return response()->json([
            'user' => $this->authService->profile($req->user())
        ]);
    }
}
