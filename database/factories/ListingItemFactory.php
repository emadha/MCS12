<?php

namespace Database\Factories;

use App\Models\ListingItem;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ListingItem>
 */
class ListingItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'user_id'     => User::all()->random()->id,
            'condition'   => rand(0, 5),
            'price'       => rand(2000, 200000),
            'currency'    => rand(0, 4),
            'created_at'  => now()->subHours(rand(10, 5000))->subMinutes(rand(10, 200)),
            'description' => $this->faker->paragraphs(rand(1, 5), true),
            'shop_id'     => rand(0, 5) == 3 ? Shop::whereHas('types', function ($q) {
                $q->where('type', 1);
            })->inRandomOrder()->first()?->id : null,

            'predefined_location' => rand(1, 20),
            'views'               => rand(0, 91723),
            'is_approved'         => true,
            'is_published'        => true,
        ];
    }
}
