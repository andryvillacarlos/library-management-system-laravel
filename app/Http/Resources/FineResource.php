<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FineResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'member' => $this->whenLoaded('transaction', function(){
                return new MemberResource($this->transaction->member);
                
            }),

            'amount' => $this->amount,
            'is_paid' => $this->is_paid,
        ];
    }
}
