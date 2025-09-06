<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fine extends Model
{
    /** @use HasFactory<\Database\Factories\FineFactory> */
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'amount',
        'is_paid',
    ];

    public function transaction(){
        return $this->belongsTo(Transaction::class,'transaction_id');
    }
}
