<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\ListingItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id'    => rand(1, 20),
            'body'       => $this->faker->text,
            'comment_id' => rand(0, 3) ? Comment::inRandomOrder()->first()?->id : null,
            'item_type'  => ListingItem::class,
            'item_id'    => rand(1, 50)
        ];
    }
}
