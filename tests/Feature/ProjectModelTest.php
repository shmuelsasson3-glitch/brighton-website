<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Support\ImageUrl;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_project_has_ordered_images_and_stats(): void
    {
        $project = Project::factory()->create();
        $project->images()->create(['path' => 'projects/x/b.jpg', 'sort_order' => 2]);
        $project->images()->create(['path' => 'projects/x/a.jpg', 'sort_order' => 1]);
        $project->stats()->create(['value' => '17', 'label' => 'Homes', 'sort_order' => 1]);

        $this->assertSame('projects/x/a.jpg', $project->images()->first()->path);
        $this->assertSame('Homes', $project->stats()->first()->label);
    }

    public function test_published_scope_filters_unpublished(): void
    {
        Project::factory()->create();
        Project::factory()->unpublished()->create();

        $this->assertSame(1, Project::published()->count());
    }

    public function test_image_url_resolves_paths_relative_to_public_root(): void
    {
        $this->assertStringEndsWith('/projects/beige/cover.jpg', ImageUrl::resolve('projects/beige/cover.jpg'));
        $this->assertStringEndsWith('/assets/images/logo.png', ImageUrl::resolve('assets/images/logo.png'));
        $this->assertStringEndsWith('/project-images/upload.jpg', ImageUrl::resolve('project-images/upload.jpg'));
    }

    public function test_overview_presence_is_derived_from_body(): void
    {
        $this->assertFalse(Project::factory()->create()->hasOverview());
        $this->assertTrue(Project::factory()->withOverview()->create()->hasOverview());
    }
}
