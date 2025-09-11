<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrackHistory extends Model
{
    protected $table = 'track_history'; // explicitly since it's not plural

    protected $fillable = [
        'transaction_id',
        'action',
        'notes',
        'action_date',
        'borrow_date',
    ];

    // relation back to transaction
    public function transaction()
    {
      return $this->belongsTo(Transaction::class);
    }
}
