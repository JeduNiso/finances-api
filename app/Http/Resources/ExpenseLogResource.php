<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'expense_id'  => $this->expense_id,
            'amount_paid' => $this->amount_paid,
            'paid_at'     => $this->paid_at?->toDateString(),
            'account_id'  => $this->account_id,
            'notes'       => $this->notes,
            'created_at'  => $this->created_at,
        ];
    }
}
