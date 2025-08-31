<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTypeRequest extends FormRequest
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
          'name' => 'required|string|unique:types,name',
        ];
    }

   public function messages()
   {
    return [
        'name.required' => 'The type name is required.',
        'name.string'   => 'The type name must be a valid string.',
        'name.unique'   => 'This type name already exists. Please choose another.',
    ];
  }

}
