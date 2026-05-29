<?php

namespace App\Http\Controllers;

use App\Contracts\Auth\JwtAuthStrategy;
use App\Http\Requests\LoginRequest;
use App\Services\Auth\MobileJwtAuthStrategy;
use App\Services\Auth\WebJwtAuthStrategy;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpFoundation\Cookie as SymfonyCookie;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService,
        private WebJwtAuthStrategy $webJwtAuthStrategy,
        private MobileJwtAuthStrategy $mobileJwtAuthStrategy,
    ) {}

    public function login(LoginRequest $req): JsonResponse
    {
        $result = $this->authService->login($req);

        if (! $result['success']) {
            return response()->json([
                'message' => $result['message'],
            ], 401);
        }

        return $this->strategyFor($req)->respond($result['user'], $result['token']);
    }

    public function logout(Request $req): JsonResponse
    {
        $this->authService->logout($req);

        return response()->json([
            'message' => 'Logout Berhasil',
        ])->withCookie($this->forgetJwtCookie());
    }

    public function profile(Request $req): JsonResponse
    {
        return response()->json([
            'user' => $this->authService->profile($req->user())
        ]);
    }

    public function refresh(Request $req): JsonResponse
    {
        try {
            $result = $this->authService->refresh($req);
        } catch (JWTException) {
            return response()->json([
                'message' => 'Token tidak valid atau tidak dapat diperbarui.',
            ], 401)->withCookie($this->forgetJwtCookie());
        }

        return $this->strategyFor($req)->respond($result['user'], $result['token']);
    }

    private function strategyFor(Request $request): JwtAuthStrategy
    {
        $clientType = strtolower((string) (
            $request->header('X-Client-Type')
            ?: $request->input('client_type', 'web')
        ));

        return $clientType === 'mobile'
            ? $this->mobileJwtAuthStrategy
            : $this->webJwtAuthStrategy;
    }

    private function forgetJwtCookie(): SymfonyCookie
    {
        return Cookie::forget(
            (string) config('jwt.cookie_key_name', 'jwt_token'),
            '/',
            null
        );
    }
}
