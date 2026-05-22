<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DebtPaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'debt_id'    => $this->debt_id,
            'amount'     => $this->amount,
            'paid_at'    => $this->paid_at?->toDateString(),
            'account_id' => $this->account_id,
            'notes'      => $this->notes,
            'created_at' => $this->created_at,
        ];
    }
}
