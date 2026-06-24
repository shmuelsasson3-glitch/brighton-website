<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactSubmissionRequest;
use App\Mail\ContactSubmissionReceived;
use App\Models\ContactSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;

class ContactSubmissionController extends Controller
{
    public function store(StoreContactSubmissionRequest $request): RedirectResponse|JsonResponse
    {
        if (filled($request->input('website'))) {
            return $request->wantsJson()
                ? response()->json(['success' => true])
                : redirect()->to(route('home').'#contact')->with('contact-success', true);
        }

        $submission = ContactSubmission::create($request->validated());

        if ($recipient = config('mail.contact_to')) {
            rescue(fn () => Mail::to($recipient)->send(new ContactSubmissionReceived($submission)));
        }

        return $request->wantsJson()
            ? response()->json(['success' => true])
            : redirect()->to(route('home').'#contact')->with('contact-success', true);
    }
}
