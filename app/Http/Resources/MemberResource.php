<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MemberResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    // App\Http\Resources\MemberResource.php
public function toArray($request): array
{
    return [
    'id'      => $this->id,
    'slug'    => $this->slug,
    'name'    => $this->name,
    'email'   => $this->email,
    'phone'   => $this->phone,
    'address' => $this->address,

    'type' => $this->whenLoaded('type', function () {
        return [
            'id'           => $this->type->id,
            'name'         => $this->type->name,
            'borrow_limit' => $this->type->policy->borrow_limit ?? 0,
            'due_days'     => $this->type->policy->due_days ?? 0,
        ];
    }),

    'current_borrowed' => $this->current_borrowed ?? 0,
];

}

}


