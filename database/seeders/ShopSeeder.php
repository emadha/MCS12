<?php

namespace Database\Seeders;

use App\Models\Shop;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ShopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        for ($i = 0; $i < 10; $i++) {
            Shop::create([
                'title'        => $faker->text(rand(5, 100)),
                'is_active'    => true,
                'user_id'      => 1,
                'is_published' => true,
                'is_approved' => true,
                'description'  => $faker->paragraph(rand(2, 10)),
                'opening_hour' => Carbon::create(hour: rand(8, 14))->format('H:i:s'),
                'closing_hour' => Carbon::create(hour: rand(13, 21))->format('H:i:s'),
                'opening_days' => [1, 2, 3, 4, 5, 6],
            ]);
        }
    }
}
