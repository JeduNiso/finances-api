<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAccountRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'account_number' => 'sometimes|string|max:50|unique:accounts,account_number,' . $this->route('account'),
            'balance'        => 'sometimes|numeric|min:0',
            'bank_id'        => 'sometimes|integer|exists:banks,id',
        ];
    }
}
