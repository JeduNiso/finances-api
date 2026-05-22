<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExpenseRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'         => 'sometimes|string|max:150',
            'amount'       => 'sometimes|numeric|min:0.01',
            'day_of_month' => 'sometimes|integer|min:1|max:31',
            'frequency'    => 'sometimes|in:monthly,bimonthly,quarterly,yearly',
            'category_id'  => 'sometimes|integer|exists:categories,id',
            'account_id'   => 'sometimes|integer|exists:accounts,id',
            'active'       => 'boolean',
        ];
    }
}
