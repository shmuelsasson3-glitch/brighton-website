<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->unique()->words(3, true);

        return [
            'title' => Str::title($title),
            'slug' => Str::slug($title),
            'category' => fake()->randomElement(['residential', 'commercial']),
            'tag' => 'Residential - NJ',
            'cover_image' => 'projects/example/cover.jpg',
            'is_published' => true,
            'sort_order' => 0,
        ];
    }

    public function unpublished(): static
    {
        return $this->state(['is_published' => false]);
    }

    public function withOverview(): static
    {
        return $this->state([
            'overview_kicker' => 'About the Project',
            'overview_heading' => fake()->sentence(4),
            'overview_body' => fake()->paragraph(),
        ]);
    }
}
