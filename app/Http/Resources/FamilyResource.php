<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FamilyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'owner'      => UserResource::make($this->whenLoaded('owner')),
            'members'    => UserResource::collection($this->whenLoaded('members')),
            'accounts'   => AccountResource::collection($this->whenLoaded('accounts')),
            'created_at' => $this->created_at?->toDateString(),
        ];
    }
}
