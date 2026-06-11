<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WorkPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_work_index_lists_only_published_projects(): void
    {
        $published = Project::factory()->create(['title' => 'Visible Project']);
        Project::factory()->unpublished()->create(['title' => 'Hidden Project']);

        $this->get('/work')
            ->assertOk()
            ->assertSee('Visible Project')
            ->assertDontSee('Hidden Project')
            ->assertSee(route('work.show', $published));
    }

    public function test_project_page_renders_gallery_and_optional_overview(): void
    {
        $project = Project::factory()->withOverview()->create();
        $project->images()->create(['path' => 'projects/x/one.jpg', 'alt' => 'First photo']);
        $project->stats()->create(['value' => '17', 'label' => 'Homes Completed']);

        $this->get("/work/{$project->slug}")
            ->assertOk()
            ->assertSee($project->title)
            ->assertSee($project->overview_body)
            ->assertSee('Homes Completed')
            ->assertSee('projects/x/one.jpg');
    }

    public function test_project_without_overview_hides_overview_section(): void
    {
        $project = Project::factory()->create();

        $this->get("/work/{$project->slug}")
            ->assertOk()
            ->assertDontSee('proj-overview');
    }

    public function test_unpublished_project_returns_404(): void
    {
        $project = Project::factory()->unpublished()->create();

        $this->get("/work/{$project->slug}")->assertNotFound();
    }
}
