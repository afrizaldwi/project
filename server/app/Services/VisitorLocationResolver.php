<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Throwable;

class VisitorLocationResolver
{
    public function resolve(?float $latitude, ?float $longitude): array
    {
        if (! $this->isValidCoordinate($latitude, $longitude)) {
            return ["country" => null, "city" => null];
        }

        try {
            $response = Http::timeout(3)
                ->acceptJson()
                ->withHeaders([
                    "User-Agent" => config("app.name", "Manajemen Kost") . " visitor analytics",
                ])
                ->get("https://nominatim.openstreetmap.org/reverse", [
                    "format" => "jsonv2",
                    "lat" => $latitude,
                    "lon" => $longitude,
                    "zoom" => 10,
                    "addressdetails" => 1,
                ]);

            if (! $response->successful()) {
                return ["country" => null, "city" => null];
            }

            $address = $response->json("address", []);

            if (! is_array($address)) {
                return ["country" => null, "city" => null];
            }

            return [
                "country" => $this->normalizeNullableText($address["country"] ?? null),
                "city" => $this->extractCity($address),
            ];
        } catch (Throwable) {
            return ["country" => null, "city" => null];
        }
    }

    private function isValidCoordinate(?float $latitude, ?float $longitude): bool
    {
        return $latitude !== null
            && $longitude !== null
            && $latitude >= -90
            && $latitude <= 90
            && $longitude >= -180
            && $longitude <= 180;
    }

    private function extractCity(array $address): ?string
    {
        foreach (["city", "town", "municipality", "village", "county", "state"] as $key) {
            $city = $this->normalizeNullableText($address[$key] ?? null);

            if ($city !== null) {
                return $city;
            }
        }

        return null;
    }

    private function normalizeNullableText(mixed $value): ?string
    {
        $value = trim((string) $value);

        return $value === "" ? null : $value;
    }
}
