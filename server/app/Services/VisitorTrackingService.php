<?php

namespace App\Services;

use App\Models\Visitor;
use Illuminate\Http\Request;

class VisitorTrackingService
{
    public function track(Request $request): bool
    {
        $visitorKey = $this->makeVisitorKey($request);
        $visitDate = now()->toDateString();

        $alreadyTracked = Visitor::where('visitor_key', $visitorKey)
            ->where('visit_date', $visitDate)
            ->exists();

        if ($alreadyTracked) {
            return false;
        }

        Visitor::create([
            'visitor_key' => $visitorKey,
            'visit_date' => $visitDate,
        ]);

        return true;
    }

    private function makeVisitorKey(Request $request): string
    {
        $rawKey = $this->normalizeIp($request->ip()) . '|' . $request->userAgent();

        return hash('sha256', $rawKey);
    }

    private function normalizeIp(string $ip): string
    {
        if (str_starts_with($ip, '::ffff:')) {
            return substr($ip, 7);
        }

        return $ip;
    }
}
