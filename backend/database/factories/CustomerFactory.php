<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'company_name' => fake()->company(),
            'contact_person' => fake()->name(),
            'phone' => fake()->numerify('+255#########'),
            'email' => fake()->unique()->companyEmail(),
            'tin' => fake()->numerify('#########'),
            'physical_address' => fake()->address(),
            'country' => 'Tanzania',
            'city' => fake()->city(),
            'is_active' => true,
        ];
    }
}
