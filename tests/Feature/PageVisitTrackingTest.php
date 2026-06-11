<?php

namespace Tests\Feature;

use App\Models\PageVisit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageVisitTrackingTest extends TestCase
{
    use RefreshDatabase;

    public function test_page_view_is_recorded(): void
    {
        $this->get('/work')->assertOk();

        $this->assertTrue(
            PageVisit::where('path', 'work')->whereDate('visited_at', today())->exists()
        );
    }

    public function test_contact_post_is_not_recorded(): void
    {
        $this->post('/contact', []);

        $this->assertDatabaseCount('page_visits', 0);
    }

    public function test_missing_pages_are_not_recorded(): void
    {
        $this->get('/work/nope')->assertNotFound();

        $this->assertDatabaseCount('page_visits', 0);
    }
}
