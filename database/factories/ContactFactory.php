<?php

namespace Database\Factories;

use App\Enum\ContactMethodEnum;
use App\Models\Contact;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Contact>
 */
class ContactFactory extends Factory
{

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = array_rand(ContactMethodEnum::names());

        return [
            'method' => $type,
            'value'  => array_rand([
                $this->faker->url,
                $this->faker->phoneNumber,
                $this->faker->numberBetween(7100000, 71999999),
            ]),
        ];
    }

}
