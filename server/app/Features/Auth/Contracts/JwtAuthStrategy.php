<?php

namespace App\Features\Auth\Contracts;

use App\Models\User;
use Illuminate\Http\JsonResponse;

interface JwtAuthStrategy
{
    public function respond(User $user, string $token): JsonResponse;
}
