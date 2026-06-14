<?php

namespace Tests\Feature;

use App\Features\VisitorAnalytics\Models\Visitor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class VisitorTrackingTest extends TestCase
{
    use RefreshDatabase;

    private const CHROMIUM_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';

    public static function browserIdentityProvider(): array
    {
        return [
            'brave' => ['Brave'],
            'chrome' => ['Chrome'],
            'edge' => ['Edge'],
            'firefox' => ['Firefox'],
            'safari' => ['Safari'],
            'opera' => ['Opera'],
            'samsung_internet' => ['Samsung Internet'],
        ];
    }

    public function test_brave_and_chrome_with_same_ip_and_user_agent_remain_separate(): void
    {
        $braveResponse = $this->trackVisitor([
            'browser_consent' => true,
            'browser_name' => 'Brave',
        ]);
        $chromeResponse = $this->trackVisitor([
            'browser_consent' => true,
            'browser_name' => 'Chrome',
        ]);

        $braveResponse->assertOk()->assertExactJson([
            'message' => 'Kunjungan berhasil dicatat.',
        ]);
        $chromeResponse->assertOk()->assertExactJson([
            'message' => 'Kunjungan berhasil dicatat.',
        ]);

        $this->assertEquals(2, Visitor::count());
        $this->assertEquals(1, Visitor::where('browser_name', 'Brave')->count());
        $this->assertEquals(1, Visitor::where('browser_name', 'Chrome')->count());
    }

    #[DataProvider('browserIdentityProvider')]
    public function test_same_browser_identity_is_counted_once_per_day(string $browserName): void
    {
        $firstResponse = $this->trackVisitor([
            'browser_consent' => true,
            'browser_name' => $browserName,
        ]);
        $secondResponse = $this->trackVisitor([
            'browser_consent' => true,
            'browser_name' => $browserName,
        ]);

        $firstResponse->assertOk()->assertExactJson([
            'message' => 'Kunjungan berhasil dicatat.',
        ]);
        $secondResponse->assertOk()->assertExactJson([
            'message' => 'Kunjungan hari ini sudah tercatat.',
        ]);

        $this->assertEquals(1, Visitor::count());
        $this->assertEquals(1, Visitor::where('browser_name', $browserName)->count());
    }

    public function test_all_supported_browser_identities_remain_separate_with_shared_user_agent(): void
    {
        $browserNames = [
            'Brave',
            'Chrome',
            'Edge',
            'Firefox',
            'Safari',
            'Opera',
            'Samsung Internet',
        ];

        foreach ($browserNames as $browserName) {
            $this->trackVisitor([
                'browser_consent' => true,
                'browser_name' => $browserName,
            ])->assertOk()->assertExactJson([
                'message' => 'Kunjungan berhasil dicatat.',
            ]);
        }

        $this->assertEquals(7, Visitor::count());

        foreach ($browserNames as $browserName) {
            $this->assertEquals(1, Visitor::where('browser_name', $browserName)->count());
        }
    }

    public function test_browser_consent_disabled_deduplicates_under_unknown_identity_without_storing_browser_name(): void
    {
        $firstResponse = $this->trackVisitor([
            'browser_consent' => false,
        ]);
        $secondResponse = $this->trackVisitor([
            'browser_consent' => false,
        ]);

        $firstResponse->assertOk()->assertExactJson([
            'message' => 'Kunjungan berhasil dicatat.',
        ]);
        $secondResponse->assertOk()->assertExactJson([
            'message' => 'Kunjungan hari ini sudah tercatat.',
        ]);

        $this->assertEquals(1, Visitor::count());
        $this->assertNull(Visitor::first()?->browser_name);
    }

    public function test_analytics_consent_is_required(): void
    {
        $response = $this->withServerVariables($this->serverVariables())
            ->postJson('/api/track-visitor', []);

        $response->assertStatus(422)->assertJsonValidationErrors(['analytics_consent']);
        $this->assertEquals(0, Visitor::count());
    }

    public function test_unsupported_browser_name_still_returns_validation_error(): void
    {
        $response = $this->trackVisitor([
            'browser_consent' => true,
            'browser_name' => 'Vivaldi',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['browser_name']);
        $this->assertEquals(0, Visitor::count());
    }

    public function test_analytics_consent_false_creates_no_visitor_record(): void
    {
        $response = $this->trackVisitor([
            'analytics_consent' => false,
            'browser_consent' => true,
            'browser_name' => 'Chrome',
        ]);

        $response->assertOk()->assertExactJson([
            'message' => 'Pelacakan kunjungan diabaikan karena persetujuan analitik belum diberikan.',
        ]);
        $this->assertEquals(0, Visitor::count());
    }

    public function test_no_new_request_field_is_required(): void
    {
        $response = $this->trackVisitor([
            'analytics_consent' => true,
        ]);

        $response->assertOk()->assertExactJson([
            'message' => 'Kunjungan berhasil dicatat.',
        ]);
        $this->assertEquals(1, Visitor::count());
        $this->assertNull(Visitor::first()?->browser_name);
    }

    private function trackVisitor(array $payload)
    {
        return $this->withServerVariables($this->serverVariables())
            ->postJson('/api/track-visitor', array_merge([
                'analytics_consent' => true,
                'location_consent' => false,
            ], $payload));
    }

    private function serverVariables(): array
    {
        return [
            'REMOTE_ADDR' => '203.0.113.10',
            'HTTP_USER_AGENT' => self::CHROMIUM_USER_AGENT,
        ];
    }
}
