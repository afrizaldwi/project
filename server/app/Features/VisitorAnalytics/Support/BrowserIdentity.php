<?php

namespace App\Features\VisitorAnalytics\Support;

final class BrowserIdentity
{
    public const BRAVE = 'Brave';
    public const CHROME = 'Chrome';
    public const EDGE = 'Edge';
    public const FIREFOX = 'Firefox';
    public const SAFARI = 'Safari';
    public const OPERA = 'Opera';
    public const SAMSUNG_INTERNET = 'Samsung Internet';
    public const UNKNOWN = 'Unknown';

    public static function values(): array
    {
        return [
            self::BRAVE,
            self::CHROME,
            self::EDGE,
            self::FIREFOX,
            self::SAFARI,
            self::OPERA,
            self::SAMSUNG_INTERNET,
            self::UNKNOWN,
        ];
    }

    public static function normalize(?string $browserName): string
    {
        $browserName = trim((string) $browserName);

        if ($browserName === "") {
            return self::UNKNOWN;
        }

        foreach (self::values() as $browser) {
            if (strcasecmp($browserName, $browser) === 0) {
                return $browser;
            }
        }

        return self::UNKNOWN;
    }
}
