<?php

namespace App\Http\Requests;

use App\Models\BlockedIp;
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
            'challenge' => ['required', 'integer', function ($attr, $val, $fail) {
                if ((int) $val !== (int) session('captcha_answer')) {
                    $fail('Incorrect answer. Please try again.');
                }
            }],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if (! $validator->errors()->has('challenge')) {
                return;
            }

            $row = BlockedIp::firstOrCreate(
                ['ip' => $this->ip()],
                ['reason' => 'captcha attempt 1', 'blocked_until' => now()->subSecond()]
            );

            if ($row->wasRecentlyCreated) {
                return;
            }

            if (str_starts_with($row->reason, 'captcha attempt ')) {
                $n = (int) str_replace('captcha attempt ', '', $row->reason);
                if ($n >= 2) {
                    $row->update(['reason' => 'captcha failures', 'blocked_until' => now()->addHours(24)]);
                } else {
                    $row->update(['reason' => 'captcha attempt '.($n + 1), 'blocked_until' => now()->subSecond()]);
                }
            }
        });
    }
}
