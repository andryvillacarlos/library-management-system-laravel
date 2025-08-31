<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
class Book extends Model
{
    /** @use HasFactory<\Database\Factories\BookFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'isbn',
        'published_year',
        'copies',
        'image_path'
    ];


    public function getRouteKeyName()
    {
    return 'slug';
    }

    protected static function booted()
    {
        static::creating(function ($book){
            if(empty($book->slug)){
                $baseSlug = Str::slug($book->title);
                $slug = $baseSlug;
                $counter = 1;


                while(Book::where('slug',$slug)->exists()){
                    $slug = "{$baseSlug}-{$counter}";
                    $counter++;
                }                       

                $book->slug = $slug;


            }
        });
    }

}
