<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeded_site_matches_original_content(): void
    {
        $this->seed();

        $this->assertSame(10, Project::count());
        $this->assertTrue(User::where('email', 'admin@brightonlawn.com')->exists());

        foreach (['toras-aron', 'scotchway', 'beige', 'pool-patio', 'baker', 'vanard', 'bates-road', 'arlington', 'corner', 'sukkah'] as $slug) {
            $this->get("/work/{$slug}")->assertOk();
        }

        $this->get('/work')
            ->assertSee('The Scotch Way Project')
            ->assertSee('The Jacks Way Project');

        $scotchway = Project::where('slug', 'scotchway')->first();
        $this->assertSame(4, $scotchway->stats()->count());
        $this->assertSame(8, $scotchway->images()->count());
    }

    public function test_seeding_twice_does_not_duplicate(): void
    {
        $this->seed();
        $this->seed();

        $this->assertSame(10, Project::count());
        $this->assertSame(1, User::count());
    }
}
