<?php

namespace App\Http\Controllers;

use App\Models\Visitor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VisitorController extends Controller
{
    public function track(Request $request): JsonResponse
    {
        $data = $request->all() ?: json_decode($request->getContent(), true);

        Visitor::create([
            'ip_address'  => $request->ip(),
            'user_agent'  => $request->userAgent(),
            'page'        => $data['page'] ?? '/',
            'visited_at'  => now(),
            'time_spent'  => $data['time_spent'] ?? 0,
            'room_viewed' => $data['room_viewed'] ?? null,
        ]);
        return response()->json([
            'message' => 'Visit tracked successfully.',
        ]);
    }
}
