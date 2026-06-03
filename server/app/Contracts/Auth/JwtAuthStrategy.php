<?php

namespace App\Contracts\Auth;

use App\Models\User;
use Illuminate\Http\JsonResponse;

interface JwtAuthStrategy
{
    public function respond(User $user, string $token): JsonResponse;
}
