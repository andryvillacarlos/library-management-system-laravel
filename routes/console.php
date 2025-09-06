<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    app(\App\Http\Controllers\FineController::class)->generateFines();
})->everyMinute();

Schedule::call(function (){
    app(\App\Http\Controllers\TransactionController::class)->deleteTransaction();
})->daily();
