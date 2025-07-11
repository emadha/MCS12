<?php

namespace Database\Factories;

use App\Models\PredefinedLocation;
use App\Models\Shop;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Shop>
 */
class ShopFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->text(rand(5, 100)),
            'slogan' => $this->faker->paragraph,
            'predefined_location' => PredefinedLocation::where('region', config('site.regions.current'))->inRandomOrder()->first()->id,
            'is_active' => true,
            'user_id' => rand(1, 10),
            'is_published' => true,
            'is_approved' => true,
            'established_at' => $this->faker->dateTimeBetween('1970-01-01', 'now'),
            'description' => $this->faker->paragraph(rand(2, 10)),
            'opening_hour' => Carbon::create(hour: rand(8, 14))->format('H:i:s'),
            'closing_hour' => Carbon::create(hour: rand(13, 21))->format('H:i:s'),
            'opening_days' => [1, 2, 3, 4, 5, 6],
        ];
    }
}
