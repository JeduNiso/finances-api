<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DebtResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'creditor'            => $this->creditor,
            'description'         => $this->description,
            'original_amount'     => $this->original_amount,
            'current_balance'     => $this->current_balance,
            'monthly_payment'     => $this->monthly_payment,
            'interest_rate'       => $this->interest_rate,
            'start_date'          => $this->start_date?->toDateString(),
            'due_date'            => $this->due_date?->toDateString(),
            'status'              => $this->status,
            'progress_percentage' => $this->progress_percentage,
            'account'             => AccountResource::make($this->whenLoaded('account')),
            'user'                => UserResource::make($this->whenLoaded('user')),
            'payments'            => DebtPaymentResource::collection($this->whenLoaded('payments')),
        ];
    }
}
