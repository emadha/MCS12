<?php

namespace Database\Factories;

use App\Models\Photo;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Photo>
 */
class PhotoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'filename' => "https://picsum.photos/id/" . rand(1, 1000) . "/2000",
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
