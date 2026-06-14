<?php

namespace Tests\Unit;

use App\Features\VisitorAnalytics\Support\BrowserIdentity;
use PHPUnit\Framework\TestCase;

class BrowserIdentityTest extends TestCase
{
    public function test_values_returns_the_exact_eight_canonical_identities(): void
    {
        $expected = [
            'Brave',
            'Chrome',
            'Edge',
            'Firefox',
            'Safari',
            'Opera',
            'Samsung Internet',
            'Unknown',
        ];

        $this->assertSame($expected, BrowserIdentity::values());
    }

    public function test_normalize_null_returns_unknown(): void
    {
        $this->assertSame('Unknown', BrowserIdentity::normalize(null));
    }

    public function test_normalize_empty_string_returns_unknown(): void
    {
        $this->assertSame('Unknown', BrowserIdentity::normalize(''));
    }

    public function test_normalize_chrome_with_whitespace_returns_chrome(): void
    {
        $this->assertSame('Chrome', BrowserIdentity::normalize(' chrome '));
    }

    public function test_normalize_uppercase_brave_returns_brave(): void
    {
        $this->assertSame('Brave', BrowserIdentity::normalize('BRAVE'));
    }

    public function test_normalize_samsung_internet_returns_samsung_internet(): void
    {
        $this->assertSame('Samsung Internet', BrowserIdentity::normalize('Samsung Internet'));
    }

    public function test_normalize_vivaldi_returns_unknown(): void
    {
        $this->assertSame('Unknown', BrowserIdentity::normalize('Vivaldi'));
    }
}
