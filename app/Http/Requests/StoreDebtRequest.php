<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDebtRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'creditor'         => 'required|string|max:150',
            'description'      => 'nullable|string|max:255',
            'original_amount'  => 'required|numeric|min:0.01',
            'current_balance'  => 'required|numeric|min:0',
            'monthly_payment'  => 'nullable|numeric|min:0',
            'interest_rate'    => 'nullable|numeric|min:0|max:100',
            'start_date'       => 'nullable|date_format:Y-m-d',
            'due_date'         => 'nullable|date_format:Y-m-d|after_or_equal:start_date',
            'status'           => 'in:active,paid,paused',
            'account_id'       => 'nullable|integer|exists:accounts,id',
        ];
    }
}
