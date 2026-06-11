<?php

namespace Database\Factories;

use App\Models\ContactSubmission;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContactSubmission>
 */
class ContactSubmissionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->safeEmail(),
            'property_type' => fake()->randomElement(['residential', 'commercial']),
            'service' => 'Backyard Design & Build',
            'details' => fake()->paragraph(),
            'status' => 'new',
        ];
    }
}
