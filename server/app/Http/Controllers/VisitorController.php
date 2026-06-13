<?php

namespace App\Http\Controllers;

use App\Services\VisitorExportService;
use App\Services\VisitorTrackingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class VisitorController extends Controller
{
    public function __construct(
        private VisitorTrackingService $visitorTrackingService,
        private VisitorExportService $visitorExportService
    ) {}

    public function track(Request $request): JsonResponse
    {
        $validated = $request->validate([
            "analytics_consent" => ["required", "boolean"],
            "location_consent" => ["nullable", "boolean"],
            "browser_consent" => ["nullable", "boolean"],
            "browser_name" => [
                "nullable",
                "string",
                "max:50",
                Rule::in([
                    "Brave",
                    "Chrome",
                    "Edge",
                    "Firefox",
                    "Safari",
                    "Opera",
                    "Samsung Internet",
                    "Unknown",
                ]),
            ],
            "latitude" => ["nullable", "numeric", "between:-90,90"],
            "longitude" => ["nullable", "numeric", "between:-180,180"],
        ]);

        $analyticsConsent = $request->boolean("analytics_consent");

        if (! $analyticsConsent) {
            return response()->json([
                "message" => "Pelacakan kunjungan diabaikan karena persetujuan analitik belum diberikan.",
            ]);
        }

        $tracked = $this->visitorTrackingService->track($request, [
            "analytics_consent" => $analyticsConsent,
            "location_consent" => $request->boolean("location_consent"),
            "browser_consent" => $request->boolean("browser_consent"),
            "browser_name" => $validated["browser_name"] ?? null,
            "latitude" => $validated["latitude"] ?? null,
            "longitude" => $validated["longitude"] ?? null,
        ]);

        if (! $tracked) {
            return response()->json([
                "message" => "Kunjungan hari ini sudah tercatat.",
            ]);
        }

        return response()->json([
            "message" => "Kunjungan berhasil dicatat.",
        ]);
    }

    public function exportCsv(): Response
    {
        return $this->visitorExportService->exportCsv();
    }
}
