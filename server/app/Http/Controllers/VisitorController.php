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
        if ($request->input('analytics_consent') !== true) {
            return response()->json([
                'message' => 'Pelacakan kunjungan diabaikan karena persetujuan analitik belum diberikan.',
            ]);
        }

        $tracked = $this->visitorTrackingService->track($request);

        if (! $tracked) {
            return response()->json([
                'message' => 'Kunjungan hari ini sudah tercatat.',
            ]);
        }

        return response()->json([
            'message' => 'Kunjungan berhasil dicatat.',
        ]);
    }
}
