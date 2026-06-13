<?php

namespace App\Features\VisitorAnalytics\Services;

use App\Features\VisitorAnalytics\Models\Visitor;
use App\Infrastructure\VisitorAnalytics\VisitorLocationResolver;
use Illuminate\Http\Request;

class VisitorTrackingService
{
    private const BROWSERS = [
        "Brave",
        "Chrome",
        "Edge",
        "Firefox",
        "Safari",
        "Opera",
        "Samsung Internet",
        "Unknown",
    ];

    public function __construct(
        private VisitorLocationResolver $visitorLocationResolver
    ) {}

    public function track(Request $request, array $data): bool
    {
        if (($data["analytics_consent"] ?? false) !== true) {
            return false;
        }

        $visitorKey = $this->makeVisitorKey($request);
        $visitDate = now()->toDateString();
        $locationConsent = ($data["location_consent"] ?? false) === true;
        $browserConsent = ($data["browser_consent"] ?? false) === true;
        $location = $locationConsent
            ? $this->visitorLocationResolver->resolve(
                isset($data["latitude"]) ? (float) $data["latitude"] : null,
                isset($data["longitude"]) ? (float) $data["longitude"] : null,
            )
            : ["country" => null, "city" => null];
        $browserName = $browserConsent
            ? $this->normalizeBrowserName($data["browser_name"] ?? null)
            : null;

        $visitor = Visitor::where("visitor_key", $visitorKey)
            ->where("visit_date", $visitDate)
            ->first();

        if ($visitor) {
            $visitor->forceFill([
                "last_seen_at" => now(),
                "analytics_consent" => true,
                "location_consent" => $locationConsent,
                "browser_consent" => $browserConsent,
                "browser_name" => $browserName,
                "country" => $location["country"],
                "city" => $location["city"],
            ])->save();

            return false;
        }

        Visitor::create([
            "visitor_key" => $visitorKey,
            "visit_date" => $visitDate,
            "last_seen_at" => now(),
            "analytics_consent" => true,
            "location_consent" => $locationConsent,
            "browser_consent" => $browserConsent,
            "browser_name" => $browserName,
            "country" => $location["country"],
            "city" => $location["city"],
        ]);

        return true;
    }

    private function makeVisitorKey(Request $request): string
    {
        $rawKey = $this->normalizeIp($request->ip()) . "|" . $request->userAgent();

        return hash("sha256", $rawKey);
    }

    private function normalizeIp(string $ip): string
    {
        if (str_starts_with($ip, "::ffff:")) {
            return substr($ip, 7);
        }

        return $ip;
    }

    private function normalizeBrowserName(?string $browserName): string
    {
        $browserName = trim((string) $browserName);

        if ($browserName === "") {
            return "Unknown";
        }

        foreach (self::BROWSERS as $browser) {
            if (strcasecmp($browserName, $browser) === 0) {
                return $browser;
            }
        }

        return "Unknown";
    }
}
