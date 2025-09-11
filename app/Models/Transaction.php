<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory;
    
    protected $fillable = [
        'member_id',
        'book_id',
        'borrow_date',
        'return_date',
        'status'
    ];

    public function book(){
        return $this->belongsTo(Book::class,'book_id');
    }
    public function member(){
        return $this->belongsTo(Member::class,'member_id');
    }

    public function fine(){
        return $this->hasMany(Fine::class);
    }

    public function history(){
        return $this->hasMany(TrackHistory::class);
    }

    protected static function booted()
    {
        static::created(function ($transaction) {
          $transaction->history()->create([
                'action' => $transaction->status,
                'notes' => 'Transaction created',
                'action_date' => Carbon::now(),
                'borrow_date' => $transaction->borrow_date,
          ]);
        });

        static::updated(function ($transaction) {
            $transaction->history()->create([
                'action' => $transaction->status,
                'notes' => 'Transaction Updated',
                'action_date' => Carbon::now(),
                'borrow_date' => $transaction->borrow_date,
            ]);
        });
    }

}
