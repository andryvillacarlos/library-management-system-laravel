<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Transaction;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'member' => $this->whenLoaded('member', function () {
                $borrowLimit = $this->member->type->policy->borrow_limit ?? 0;
                $currentBorrowed = Transaction::where('member_id', $this->member_id)
                                        ->where('status','borrowed')
                                        ->count();

                return [
                    'id' => $this->member->id,
                    'name' => $this->member->name,
                    'email' => $this->member->email,
                    'type' => $this->member->type ? [
                        'id' => $this->member->type->id,
                        'name' => $this->member->type->name,
                    ] : null,
                    'borrow_limit' => $borrowLimit,
                    'current_borrowed' => $currentBorrowed,
                ];
            }),
            'book' => $this->whenLoaded('book', function () {
                return [
                    'id' => $this->book->id,
                    'title' => $this->book->title,
                ];
            }),
            'borrow_date' => $this->borrow_date,
            'due_date' => $this->due_date,
            'return_date' => $this->return_date,
            'status' => $this->status,
        ];
    }
}
