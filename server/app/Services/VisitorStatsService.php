<?php

namespace App\Services;

use App\Models\Visitor;
use Illuminate\Support\Collection;

class VisitorStatsService
{
    private const UNKNOWN = "Tidak diketahui";

    public function getStats(): array
    {
        $visitors = $this->baseVisitorRows();
        $locations = $this->getLocationVisitors($visitors);
        $browsers = $this->getBrowserVisitors($visitors);
        $topLocation = $locations->first();
        $topBrowser = $browsers->first();

        return [
            "total_unique_visitors" => $visitors->count(),
            "today_unique_visitors" => $visitors
                ->filter(fn($visitor): bool => $this->formatDate($visitor->visit_date) === now()->toDateString())
                ->count(),
            "top_location" => $topLocation ? [
                "country" => $topLocation["country"],
                "city" => $topLocation["city"],
                "total" => $topLocation["unique_visitors"],
            ] : [
                "country" => self::UNKNOWN,
                "city" => self::UNKNOWN,
                "total" => 0,
            ],
            "top_browser" => $topBrowser ? [
                "browser_name" => $topBrowser["browser_name"],
                "total" => $topBrowser["unique_visitors"],
            ] : [
                "browser_name" => self::UNKNOWN,
                "total" => 0,
            ],
            "daily_visitors" => $this->getDailyVisitors($visitors)->values()->all(),
            "location_visitors" => $locations->values()->all(),
            "browser_visitors" => $browsers->values()->all(),
            "consent_summary" => [
                "analytics_allowed" => $visitors->where("analytics_consent", true)->count(),
                "location_allowed" => $visitors->where("location_consent", true)->count(),
                "location_rejected" => $visitors
                    ->filter(fn($visitor): bool => $visitor->analytics_consent && ! $visitor->location_consent)
                    ->count(),
                "browser_allowed" => $visitors->where("browser_consent", true)->count(),
                "browser_rejected" => $visitors
                    ->filter(fn($visitor): bool => $visitor->analytics_consent && ! $visitor->browser_consent)
                    ->count(),
            ],
        ];
    }

    public function getExportRows(): array
    {
        return $this->baseVisitorRows()
            ->groupBy(function ($visitor): string {
                return implode("|", [
                    $this->formatDate($visitor->visit_date),
                    $this->knownValue($visitor->country),
                    $this->knownValue($visitor->city),
                ]);
            })
            ->map(function (Collection $group): array {
                $first = $group->first();

                return [
                    "date" => $this->formatDate($first->visit_date),
                    "country" => $this->knownValue($first->country),
                    "city" => $this->knownValue($first->city),
                    "unique_visitors" => $group->count(),
                ];
            })
            ->sortBy([
                ["date", "asc"],
                ["country", "asc"],
                ["city", "asc"],
            ])
            ->values()
            ->all();
    }

    private function baseVisitorRows(): Collection
    {
        return Visitor::query()
            ->orderBy("visit_date")
            ->get([
                "visit_date",
                "country",
                "city",
                "browser_name",
                "analytics_consent",
                "location_consent",
                "browser_consent",
            ]);
    }

    private function getDailyVisitors(Collection $visitors): Collection
    {
        return $visitors
            ->groupBy(fn($visitor): string => $this->formatDate($visitor->visit_date))
            ->map(fn(Collection $group, string $date): array => [
                "date" => $date,
                "unique_visitors" => $group->count(),
            ])
            ->sortBy("date");
    }

    private function getLocationVisitors(Collection $visitors): Collection
    {
        return $visitors
            ->groupBy(fn($visitor): string => $this->knownValue($visitor->country) . "|" . $this->knownValue($visitor->city))
            ->map(function (Collection $group): array {
                $first = $group->first();

                return [
                    "country" => $this->knownValue($first->country),
                    "city" => $this->knownValue($first->city),
                    "unique_visitors" => $group->count(),
                ];
            })
            ->sortByDesc("unique_visitors");
    }

    private function getBrowserVisitors(Collection $visitors): Collection
    {
        return $visitors
            ->groupBy(fn($visitor): string => $this->knownValue($visitor->browser_name))
            ->map(function (Collection $group): array {
                $first = $group->first();

                return [
                    "browser_name" => $this->knownValue($first->browser_name),
                    "unique_visitors" => $group->count(),
                ];
            })
            ->sortByDesc("unique_visitors");
    }

    private function knownValue(?string $value): string
    {
        $value = trim((string) $value);

        return $value === "" ? self::UNKNOWN : $value;
    }

    private function formatDate($value): string
    {
        return is_string($value) ? $value : $value->toDateString();
    }
}
