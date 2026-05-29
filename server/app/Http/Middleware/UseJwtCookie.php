<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class UseJwtCookie
{
    public function handle(Request $request, Closure $next): mixed
    {
        if (! $request->headers->has('Authorization')) {
            $token = $request->cookies->get((string) config('jwt.cookie_key_name', 'jwt_token'));

            if (is_string($token) && $token !== '') {
                $request->headers->set('Authorization', 'Bearer ' . $token);
            }
        }

        return $next($request);
    }
}
