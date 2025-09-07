<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email', // ✅ remove 'lowercase' — Laravel has no 'lowercase' rule
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'profile_picture' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ];
    }

    public function prepareForValidation()
    {
        // If you want to automatically lowercase the email before validation:
        if ($this->has('email')) {
            $this->merge([
                'email' => strtolower($this->input('email')),
            ]);
        }
    }
}
