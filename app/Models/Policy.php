<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Policy extends Model
{
    protected $fillable = [
        'type_id',
        'borrow_limit',
        'due_days',
    ];
    
    public function type(){
     return $this->belongsTo(Type::class,'type_id');
    }
}
