<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExpenseRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'         => 'required|string|max:150',
            'amount'       => 'required|numeric|min:0.01',
            'day_of_month' => 'required|integer|min:1|max:31',
            'frequency'    => 'required|in:monthly,bimonthly,quarterly,yearly',
            'category_id'  => 'required|integer|exists:categories,id',
            'account_id'   => 'required|integer|exists:accounts,id',
            'active'       => 'boolean',
        ];
    }
}
