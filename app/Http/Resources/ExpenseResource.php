<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'amount'       => $this->amount,
            'day_of_month' => $this->day_of_month,
            'frequency'    => $this->frequency,
            'active'       => $this->active,
            'category'     => CategoryResource::make($this->whenLoaded('category')),
            'account'      => AccountResource::make($this->whenLoaded('account')),
            'logs'         => ExpenseLogResource::collection($this->whenLoaded('logs')),
        ];
    }
}
