<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Models\Type;
use App\Models\Policy;
class Member extends Model
{
    /** @use HasFactory<\Database\Factories\MemberFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'slug',
        'type_id',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    protected static function booted()
    {
        static::creating(function ($member){
           if(empty($member->slug)){
             $baseSlug = Str::slug($member->name);
             $slug = $baseSlug;
             $counter = 1;

             while(Member::where('slug',$slug)->exists()){
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
             }

             $member->slug = $slug;
           }
        });
    }

    public function type(){
        return $this->belongsTo(Type::class,'type_id');
    }

   public function policy(){
     return $this->hasOne(Policy::class);
   }
}
