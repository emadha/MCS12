<?php

namespace Database\Factories;

use App\Models\ListingItemsCar;
use Faker\Provider\Fakecar;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ListingItemsCar>
 */
class ListingItemsCarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $faker = (new \Faker\Factory())::create();
        $faker->addProvider(new Fakecar($faker));

        return [
            'car_id'            => rand(1, 70987),
            'exterior_color'    => array_rand(ListingItemsCar::EXTERIOR_COLORS),
            'interior_color'    => array_rand(ListingItemsCar::INTERIOR_COLORS),
            'interior_material' => array_rand(ListingItemsCar::INTERIOR_MATERIAL),
            'odometer'          => rand(0, 300000),
            'year'              => rand(1942, 2024),
            'vin'               => $faker->vin,
        ];
    }
}
