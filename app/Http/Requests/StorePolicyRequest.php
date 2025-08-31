<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePolicyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

public function rules(): array
{
    return [
        'type_id'      => ['required', 'exists:types,id'],
        'borrow_limit' => ['required', 'integer', 'min:1'],
        'due_days'     => ['required', 'integer', 'min:1'],
    ];
}

 public function messages(): array
{
    return [
        'type_id.required'      => 'The policy type is required.',
        'type_id.exists'        => 'The selected type is invalid.',
        'borrow_limit.required' => 'The borrow limit is required.',
        'borrow_limit.integer'  => 'The borrow limit must be a number.',
        'due_days.required'     => 'The due days field is required.',
        'due_days.integer'      => 'The due days must be a number.',
    ];
}

}
