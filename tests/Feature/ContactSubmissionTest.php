<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_submission_is_stored_and_confirmed(): void
    {
        $response = $this->post('/contact', [
            'name' => 'Jane Smith',
            'phone' => '(848) 226-0090',
            'email' => 'jane@example.com',
            'property_type' => 'residential',
            'service' => 'Backyard Design & Build',
            'details' => 'Full backyard renovation.',
        ]);

        $response->assertRedirect(route('home').'#contact')->assertSessionHas('contact-success');
        $this->assertDatabaseHas('contact_submissions', [
            'email' => 'jane@example.com',
            'status' => 'new',
        ]);
    }

    public function test_invalid_submission_is_rejected(): void
    {
        $this->from('/')->post('/contact', [
            'name' => '',
            'phone' => '',
            'email' => 'not-an-email',
            'property_type' => 'farm',
        ])->assertRedirect('/')->assertSessionHasErrors(['name', 'phone', 'email', 'property_type']);

        $this->assertDatabaseCount('contact_submissions', 0);
    }
}
