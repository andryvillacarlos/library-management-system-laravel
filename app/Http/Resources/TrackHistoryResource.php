<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrackHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
          'member' => new MemberResource($this->transaction->member),
          'action' => $this->action,
          'notes' => $this->notes,
          'action_date' => $this->action_date,
          'borrow_date' => $this->borrow_date,
          'book' => new BookResource($this->transaction->book),

        ];
    }
}
