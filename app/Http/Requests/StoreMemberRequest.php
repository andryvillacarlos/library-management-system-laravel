<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMemberRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'    => 'required|string|max:100',
            'email'   => 'required|email|unique:members,email',
            'phone'   => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'type_id' => 'required|exists:types,id',
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'name.required'     => 'The full name is required.',
            'name.max'          => 'The full name may not be greater than 100 characters.',
            
            'email.required'    => 'The email address is required.',
            'email.email'       => 'Please provide a valid email address.',
            'email.unique'      => 'This email address is already registered.',

            'phone.max'         => 'The phone number may not exceed 20 characters.',

            'address.max'       => 'The address may not exceed 255 characters.',

            'type_id.required'  => 'Please select a member type.',
            'type_id.exists'    => 'The selected member type is invalid.',
        ];
    }
}
