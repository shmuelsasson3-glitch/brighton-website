<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactSubmissionRequest;
use App\Models\ContactSubmission;
use Illuminate\Http\RedirectResponse;

class ContactSubmissionController extends Controller
{
    public function store(StoreContactSubmissionRequest $request): RedirectResponse
    {
        ContactSubmission::create($request->validated());

        return redirect()->to(route('home').'#contact')->with('contact-success', true);
    }
}
