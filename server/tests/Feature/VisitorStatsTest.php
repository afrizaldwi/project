<?php

namespace Tests\Feature;

use App\Models\User;
use App\Features\VisitorAnalytics\Models\Visitor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class VisitorStatsTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'nama_lengkap' => 'Test Admin',
            'no_hp' => '081234567890',
        ]);
    }

    public function test_default_period_returns_7_days(): void
    {
        Visitor::factory()->create(['visit_date' => now()->toDateString()]);

        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/admin/visitor-stats');

        $response->assertOk();
        $dailyVisitors = $response->json('daily_visitors');
        $this->assertCount(7, $dailyVisitors);
    }

    public function test_period_7_returns_seven_dates(): void
    {
        Visitor::factory()->create(['visit_date' => now()->toDateString()]);

        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/admin/visitor-stats?period=7');

        $response->assertOk();
        $dailyVisitors = $response->json('daily_visitors');
        $this->assertCount(7, $dailyVisitors);
    }

    public function test_period_30_returns_thirty_dates(): void
    {
        Visitor::factory()->create(['visit_date' => now()->toDateString()]);

        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/admin/visitor-stats?period=30');

        $response->assertOk();
        $dailyVisitors = $response->json('daily_visitors');
        $this->assertCount(30, $dailyVisitors);
    }

    public function test_period_90_returns_ninety_dates(): void
    {
        Visitor::factory()->create(['visit_date' => now()->toDateString()]);

        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/admin/visitor-stats?period=90');

        $response->assertOk();
        $dailyVisitors = $response->json('daily_visitors');
        $this->assertCount(90, $dailyVisitors);
    }

    public function test_period_all_starts_from_earliest_date(): void
    {
        $timezone = config('app.timezone', 'Asia/Jakarta');
        $today = Carbon::now($timezone)->startOfDay();
        $earliestDate = $today->copy()->subDays(15);

        Visitor::factory()->create(['visit_date' => $earliestDate->toDateString()]);
        Visitor::factory()->create(['visit_date' => $today->toDateString()]);

        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/admin/visitor-stats?period=all');

        $response->assertOk();
        $dailyVisitors = $response->json('daily_visitors');

        $expectedDays = $earliestDate->diffInDays($today) + 1;
        $this->assertCount($expectedDays, $dailyVisitors);

        $this->assertEquals($earliestDate->toDateString(), $dailyVisitors[0]['date']);

        $this->assertEquals($today->toDateString(), $dailyVisitors[count($dailyVisitors) - 1]['date']);
    }

    public function test_missing_dates_have_zero_count(): void
    {
        $timezone = config('app.timezone', 'Asia/Jakarta');
        $today = Carbon::now($timezone)->startOfDay();

        Visitor::factory()->count(3)->create(['visit_date' => $today->toDateString()]);

        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/admin/visitor-stats?period=7');

        $response->assertOk();
        $dailyVisitors = $response->json('daily_visitors');
        $this->assertCount(7, $dailyVisitors);

        $lastEntry = $dailyVisitors[6];
        $this->assertEquals($today->toDateString(), $lastEntry['date']);
        $this->assertEquals(3, $lastEntry['unique_visitors']);

        for ($i = 0; $i < 6; $i++) {
            $this->assertEquals(
                0,
                $dailyVisitors[$i]['unique_visitors'],
                "Expected zero visitors for date {$dailyVisitors[$i]['date']}"
            );
        }
    }

    public function test_dates_are_chronologically_ordered(): void
    {
        Visitor::factory()->create(['visit_date' => now()->subDays(5)->toDateString()]);
        Visitor::factory()->create(['visit_date' => now()->toDateString()]);

        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/admin/visitor-stats?period=7');

        $response->assertOk();
        $dailyVisitors = $response->json('daily_visitors');

        for ($i = 1; $i < count($dailyVisitors); $i++) {
            $this->assertGreaterThan(
                $dailyVisitors[$i - 1]['date'],
                $dailyVisitors[$i]['date'],
                "Dates are not in chronological order at index {$i}"
            );
        }
    }

    public function test_invalid_period_returns_validation_error(): void
    {
        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/admin/visitor-stats?period=999');

        $response->assertStatus(422);
        $response->assertJsonStructure([
            'message',
            'errors' => ['period'],
        ]);
    }

    public function test_browser_stats_unaffected_by_period(): void
    {
        Visitor::factory()->create([
            'visit_date' => now()->toDateString(),
            'browser_name' => 'Chrome',
        ]);
        Visitor::factory()->create([
            'visit_date' => now()->subDays(10)->toDateString(),
            'browser_name' => 'Firefox',
        ]);
        Visitor::factory()->create([
            'visit_date' => now()->subDays(50)->toDateString(),
            'browser_name' => 'Safari',
        ]);

        $response7 = $this->actingAs($this->admin, 'api')
            ->getJson('/api/admin/visitor-stats?period=7');

        $responseAll = $this->actingAs($this->admin, 'api')
            ->getJson('/api/admin/visitor-stats?period=all');

        $response7->assertOk();
        $responseAll->assertOk();

        $this->assertEquals(
            $response7->json('browser_visitors'),
            $responseAll->json('browser_visitors'),
            'Browser stats should not be affected by the period parameter'
        );

        $browserNames = collect($response7->json('browser_visitors'))->pluck('browser_name')->all();
        $this->assertContains('Chrome', $browserNames);
        $this->assertContains('Firefox', $browserNames);
        $this->assertContains('Safari', $browserNames);
    }

    public function test_visitor_stats_returns_correct_structure(): void
    {
        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/admin/visitor-stats');

        $response->assertOk()
            ->assertJsonStructure([
                'total_unique_visitors',
                'today_unique_visitors',
                'top_location' => ['country', 'city', 'total'],
                'top_browser' => ['browser_name', 'total'],
                'daily_visitors',
                'location_visitors',
                'browser_visitors',
                'consent_summary' => [
                    'analytics_allowed',
                    'location_allowed',
                    'location_rejected',
                    'browser_allowed',
                    'browser_rejected',
                ],
            ]);
    }

    public function test_visitor_stats_requires_authentication(): void
    {
        $this->getJson('/api/admin/visitor-stats')
            ->assertUnauthorized();
    }

    public function test_daily_visitors_have_integer_counts(): void
    {
        Visitor::factory()->count(3)->create(['visit_date' => now()->toDateString()]);

        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/admin/visitor-stats?period=7');

        $response->assertOk();
        $dailyVisitors = $response->json('daily_visitors');

        foreach ($dailyVisitors as $entry) {
            $this->assertIsInt($entry['unique_visitors']);
        }
    }

    public function test_daily_endpoint_requires_authentication(): void
    {
        $this->getJson('/api/admin/visitor-stats/daily')
            ->assertUnauthorized();
    }

    public function test_daily_endpoint_returns_only_daily_visitors(): void
    {
        Visitor::factory()->create(['visit_date' => now()->toDateString()]);

        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/admin/visitor-stats/daily?period=7');

        $response->assertOk()
            ->assertJsonStructure(['daily_visitors']);

        $this->assertArrayNotHasKey('browser_visitors', $response->json());
        $this->assertArrayNotHasKey('location_visitors', $response->json());
        $this->assertCount(7, $response->json('daily_visitors'));
    }

    public function test_daily_endpoint_validates_period(): void
    {
        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/admin/visitor-stats/daily?period=invalid');

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['period']);
    }

    public function test_daily_endpoint_handles_all_period_with_zero_fill(): void
    {
        $timezone = config('app.timezone', 'Asia/Jakarta');
        $today = Carbon::now($timezone)->startOfDay();
        $earliestDate = $today->copy()->subDays(5);

        Visitor::factory()->create(['visit_date' => $earliestDate->toDateString()]);
        Visitor::factory()->create(['visit_date' => $today->toDateString()]);

        $response = $this->actingAs($this->admin, 'api')
            ->getJson('/api/admin/visitor-stats/daily?period=all');

        $response->assertOk();
        $this->assertCount(6, $response->json('daily_visitors'));
    }
}
