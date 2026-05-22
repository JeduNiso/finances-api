<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSpendingRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'amount'      => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
            'spent_at'    => 'required|date_format:Y-m-d',
            'account_id'  => 'required|integer|exists:accounts,id',
            'category_id' => 'required|integer|exists:categories,id',
        ];
    }
}
