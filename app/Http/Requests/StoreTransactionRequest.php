<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // allow all authenticated users for now
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
            'member_id'   => ['required', 'exists:members,id'],
            'book_id'     => ['required', 'exists:books,id'],
            'borrow_date' => ['required', 'date'],
            'return_date' => ['nullable', 'date', 'after_or_equal:borrow_date'],
           'status' => ['nullable', 'in:borrowed,returned'],

        ];
    }

    /**
     * Custom error messages (optional).
     */
    public function messages(): array
    {
        return [
            'member_id.required'   => 'Member is required.',
            'member_id.exists'     => 'Selected member does not exist.',
            'book_id.required'     => 'Book is required.',
            'book_id.exists'       => 'Selected book does not exist.',
            'borrow_date.required' => 'Borrow date is required.',
            'borrow_date.date'     => 'Borrow date must be a valid date.',
            'return_date.date'     => 'Return date must be a valid date.',
            'return_date.after_or_equal' => 'Return date must be after or equal to borrow date.',
            'status.required'      => 'Status is required.',
            'status.in'            => 'Status must be either borrowed or returned.',
        ];
    }
}
