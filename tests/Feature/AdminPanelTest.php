<?php

namespace Tests\Feature;

use App\Models\ContactSubmission;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
    }

    public function test_admin_sees_dashboard_and_resources(): void
    {
        $admin = User::factory()->create();
        Project::factory()->create(['title' => 'Seeded Project']);
        ContactSubmission::factory()->create();

        $this->actingAs($admin)->get('/admin')->assertOk();
        $this->actingAs($admin)->get('/admin/projects')
            ->assertOk()
            ->assertSee('Seeded Project')
            ->assertSee('projects/example/cover.jpg');
        $this->actingAs($admin)->get('/admin/contact-submissions')->assertOk();
        $this->actingAs($admin)->get('/admin/users')->assertOk();
    }

    public function test_admin_panel_uses_spa_navigation_and_brighton_theme(): void
    {
        $admin = User::factory()->create();

        $this->assertTrue(\Filament\Facades\Filament::getPanel('admin')->hasSpaMode());

        $this->actingAs($admin)->get('/admin')
            ->assertOk()
            ->assertSee('bw-fade-up', false)
            ->assertSee('View website');
    }

    public function test_login_page_is_branded(): void
    {
        $this->get('/admin/login')
            ->assertOk()
            ->assertSee('Admin Login');
    }
}
