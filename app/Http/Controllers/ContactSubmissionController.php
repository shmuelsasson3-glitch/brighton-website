<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactSubmissionRequest;
use App\Mail\ContactSubmissionReceived;
use App\Models\ContactSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;

class ContactSubmissionController extends Controller
{
    public function store(StoreContactSubmissionRequest $request): RedirectResponse
    {
        $submission = ContactSubmission::create($request->validated());

        if ($recipient = config('mail.contact_to')) {
            rescue(fn () => Mail::to($recipient)->send(new ContactSubmissionReceived($submission)));
        }

        return redirect()->to(route('home').'#contact')->with('contact-success', true);
    }
}
