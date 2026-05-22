<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SpendingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'amount'      => $this->amount,
            'description' => $this->description,
            'spent_at'    => $this->spent_at?->toDateString(),
            'account'     => AccountResource::make($this->whenLoaded('account')),
            'category'    => CategoryResource::make($this->whenLoaded('category')),
            'user'        => UserResource::make($this->whenLoaded('user')),
            'created_at'  => $this->created_at,
        ];
    }
}
