<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactSubmissionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:255'],
            'property_type' => ['required', 'in:residential,commercial'],
            'service' => ['nullable', 'string', 'max:255'],
            'details' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
