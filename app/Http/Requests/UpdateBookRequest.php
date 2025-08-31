<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class UpdateBookRequest extends FormRequest
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
        'title' => ['required', 'string', 'max:255'],
        'author' => ['required', 'string', 'max:255'],
        'isbn' => [
            'required',
            'string',
            'max:50',
            Rule::unique('books', 'isbn')->ignore($this->book->id),
        ],
        'published_year' => ['nullable', 'integer'],
        'copies' => ['required', 'integer', 'min:1'],
        'image_path' => ['nullable', 'image', 'max:2048'],
    ];
}

    public function messages()
    {
        return [
            'title.required' => 'Book title is required.',
            'author.required' => 'Author name is required.',
            'isbn.required' => 'ISBN is required.',
            'isbn.unique' => 'This ISBN already exists.',
            'published_year.required' => 'Published year is required.',
            'copies.required' => 'Number of copies is required.',
            'image_path.image' => 'Uploaded file must be an image.',
            'image_path.max' => 'Image size should not exceed 2MB.',
        ];
    }
}

