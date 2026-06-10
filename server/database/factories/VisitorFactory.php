<?php

namespace Database\Factories;

use App\Models\Visitor;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Visitor>
 */
class VisitorFactory extends Factory
{
    protected $model = Visitor::class;

    public function definition(): array
    {
        return [
            'visitor_key' => hash('sha256', Str::random(40)),
            'visit_date' => $this->faker->dateTimeBetween('-30 days', 'now')->format('Y-m-d'),
            'country' => $this->faker->country(),
            'city' => $this->faker->city(),
            'browser_name' => $this->faker->randomElement(['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Brave']),
            'last_seen_at' => now(),
            'analytics_consent' => true,
            'location_consent' => $this->faker->boolean(),
            'browser_consent' => $this->faker->boolean(),
        ];
    }
}
