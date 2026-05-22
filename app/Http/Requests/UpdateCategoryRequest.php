<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'  => 'sometimes|string|max:100|unique:categories,name,' . $this->route('category'),
            'icon'  => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
        ];
    }
}
