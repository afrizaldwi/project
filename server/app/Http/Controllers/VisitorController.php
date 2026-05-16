<?php

namespace App\Http\Controllers;

use App\Services\VisitorTrackingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VisitorController extends Controller
{
    public function __construct(
        private VisitorTrackingService $visitorTrackingService
    ) {}

    public function track(Request $request): JsonResponse
    {
        $tracked = $this->visitorTrackingService->track($request);

        if (! $tracked) {
            return response()->json([
                'message' => 'Visit already tracked today.',
            ]);
        }

        return response()->json([
            'message' => 'Visit tracked successfully.',
        ]);
    }
}
