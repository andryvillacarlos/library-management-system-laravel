<?php

namespace App\Providers;

use App\Models\Book;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use App\Models\Member;
class RouteServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Route::bind('book', function($value) {
            return Book::where('slug',$value)->firstOrFail();
        });

        Route::bind('member', function($value) {
            return Member::where('slug',$value)->firstOrFail();
        });
    }
}
