<?php
$submission = App\Models\ContactSubmission::factory()->make();
$submission->created_at = now();
$html = (new App\Mail\ContactSubmissionReceived($submission))->render();
echo strlen($html)." bytes, logo: ".(str_contains($html, 'assets/images/logo.png') ? 'yes' : 'no').", brand: ".(str_contains($html, '#1B3D2B') ? 'yes' : 'no')."\n";
