<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PayExpenseRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'amount_paid' => 'required|numeric|min:0.01',
            'paid_at'     => 'required|date_format:Y-m-d',
            'account_id'  => 'required|integer|exists:accounts,id',
            'notes'       => 'nullable|string|max:255',
        ];
    }
}
