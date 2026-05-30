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

        $response = response()->json([
            'message' => 'Logout Berhasil',
        ]);

        foreach ($this->logoutCookies() as $cookie) {
            $response->withCookie($cookie);
        }

        return $response;
    }

    public function profile(Request $req): JsonResponse
    {
        return response()->json([
            'user' => $this->authService->profile($req->user())
        ]);
    }

    public function updatePassword(Request $req): JsonResponse
    {
        $validated = $req->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $this->authService->changePassword(
            $req->user(),
            $validated['current_password'],
            $validated['password']
        );

        $this->authService->logout($req);

        $response = response()->json([
            'message' => 'Password berhasil diubah. Silakan login kembali.',
        ]);

        foreach ($this->logoutCookies() as $cookie) {
            $response->withCookie($cookie);
        }

        return $response;
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

    /**
     * @return SymfonyCookie[]
     */
    private function logoutCookies(): array
    {
        $cookies = [
            $this->forgetJwtCookie(),
            Cookie::forget('XSRF-TOKEN', '/', null),
            Cookie::forget('laravel_session', '/', null),
        ];

        $sessionCookie = (string) config('session.cookie', 'laravel_session');

        if ($sessionCookie !== 'laravel_session') {
            $cookies[] = Cookie::forget($sessionCookie, '/', null);
        }

        $sessionDomain = config('session.domain');

        if (is_string($sessionDomain) && $sessionDomain !== '') {
            $cookies[] = Cookie::forget('XSRF-TOKEN', '/', $sessionDomain);
            $cookies[] = Cookie::forget('laravel_session', '/', $sessionDomain);

            if ($sessionCookie !== 'laravel_session') {
                $cookies[] = Cookie::forget($sessionCookie, '/', $sessionDomain);
            }
        }

        return $cookies;
    }

}
