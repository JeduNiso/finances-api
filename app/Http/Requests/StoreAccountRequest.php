<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAccountRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'account_number' => 'required|string|max:50|unique:accounts,account_number',
            'balance'        => 'required|numeric|min:0',
            'bank_id'        => 'required|integer|exists:banks,id',
        ];
    }
}
