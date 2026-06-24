<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactSubmissionRequest;
use App\Mail\ContactSubmissionReceived;
use App\Models\BlockedIp;
use App\Models\ContactSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;

class ContactSubmissionController extends Controller
{
    public function store(StoreContactSubmissionRequest $request): RedirectResponse|JsonResponse
    {
        $fakeSuccess = $request->wantsJson()
            ? response()->json(['success' => true])
            : redirect()->to(route('home').'#contact')->with('contact-success', true);

        // Honeypot: block IP for 24h and silently succeed
        if (filled($request->input('website'))) {
            BlockedIp::updateOrCreate(
                ['ip' => $request->ip()],
                ['reason' => 'honeypot', 'blocked_until' => now()->addHours(24)]
            );
            return $fakeSuccess;
        }

        // JS check: _fl field is set by JavaScript on page load
        $formLoaded = (int) $request->input('_fl');
        if (! $formLoaded) {
            return $fakeSuccess;
        }

        // Timing check: must be 3–3600 seconds since form loaded
        $elapsed = (int) (microtime(true) * 1000) - $formLoaded;
        if ($elapsed < 3000 || $elapsed > 3_600_000) {
            return $fakeSuccess;
        }

        $submission = ContactSubmission::create($request->safe()->except(['challenge']));

        if ($recipient = config('mail.contact_to')) {
            rescue(fn () => Mail::to($recipient)->send(new ContactSubmissionReceived($submission)));
        }

        return $request->wantsJson()
            ? response()->json(['success' => true])
            : redirect()->to(route('home').'#contact')->with('contact-success', true);
    }
}
