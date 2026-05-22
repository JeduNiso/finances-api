<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDebtRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'creditor'        => 'sometimes|string|max:150',
            'description'     => 'nullable|string|max:255',
            'original_amount' => 'sometimes|numeric|min:0.01',
            'current_balance' => 'sometimes|numeric|min:0',
            'monthly_payment' => 'nullable|numeric|min:0',
            'interest_rate'   => 'nullable|numeric|min:0|max:100',
            'start_date'      => 'nullable|date_format:Y-m-d',
            'due_date'        => 'nullable|date_format:Y-m-d',
            'status'          => 'sometimes|in:active,paid,paused',
            'account_id'      => 'nullable|integer|exists:accounts,id',
        ];
    }
}
