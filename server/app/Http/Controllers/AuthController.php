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
        $result = $this->authService->login($req);

        if (!$result['success']) {
            return response()->json([
                'message' => $result['message']
            ], 401);
        }

        $response = [
            'message' => 'Login Berhasil',
            'user' => $result['user'],
        ];

        if (!empty($result['token'])) {
            $response['token'] = $result['token'];
        }

        return response()->json($response);
    }

    public function logout(Request $req): JsonResponse
    {
        $this->authService->logout($req);

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
