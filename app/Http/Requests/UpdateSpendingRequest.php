<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSpendingRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'amount'      => 'sometimes|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
            'spent_at'    => 'sometimes|date_format:Y-m-d',
            'account_id'  => 'sometimes|integer|exists:accounts,id',
            'category_id' => 'sometimes|integer|exists:categories,id',
        ];
    }
}
