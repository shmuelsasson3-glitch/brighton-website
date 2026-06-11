<?php

namespace Tests\Feature;

use App\Mail\ContactSubmissionReceived;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_submission_is_stored_and_confirmed(): void
    {
        Mail::fake();

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
        Mail::assertSent(ContactSubmissionReceived::class, function (ContactSubmissionReceived $mail): bool {
            return $mail->hasTo(config('mail.contact_to'))
                && $mail->hasReplyTo('jane@example.com');
        });
    }

    public function test_notification_failure_does_not_lose_the_submission(): void
    {
        Mail::shouldReceive('to')->andThrow(new \RuntimeException('SMTP down'));

        $this->post('/contact', [
            'name' => 'Jane Smith',
            'phone' => '(848) 226-0090',
            'email' => 'jane@example.com',
            'property_type' => 'residential',
        ])->assertRedirect(route('home').'#contact');

        $this->assertDatabaseCount('contact_submissions', 1);
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
