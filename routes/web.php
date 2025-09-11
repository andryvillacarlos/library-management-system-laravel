<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FineController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PolicyController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TypeController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;


// Fallback 
Route::fallback(fn()=>inertia('Errors/NotFound',[
    'status' => 404
]));

// Landing Page
Route::get('/',function(){
     if(Auth::check()){
        return redirect()->route('dashboard');
     } 

     return inertia('Auth/Login');
});

// Auth and verified
Route::middleware(['auth','verified'])->group(function (){
   
    Route::get('/dashboard',[DashboardController::class,'allData'])
                           ->name('dashboard');
    
    Route::resource('books',BookController::class);
    Route::resource('members',MemberController::class);
  // Borrow form (show form)
  
Route::get('/borrow/books', [TransactionController::class, 'borrowForm'])
    ->name('transaction.borrow.form');

// Borrow store (submit form)
Route::post('/borrow/books', [TransactionController::class, 'borrowBook'])
    ->name('transaction.borrow.store');

// Borrow list (view all borrowed)
Route::get('/borrow/borrow-list', [TransactionController::class, 'borrowList'])
    ->name('transaction.borrow.list');

// Return Books
Route::post('/transaction/{transaction}/return', [TransactionController::class, 'markAsReturned'])
     ->name('transaction.return');
// Fines list
Route::get('/fines/list',[FineController::class,'fineList'])
    ->name('fines.list');
// Update the fines
Route::get('/fines/update',[FineController::class,'generateFines'])
    ->name('fines.update');
// Mark as paid
Route::post('fines/{fine}/pay',[FineController::class,'markAsPaid'])->name('fines.paid');

// Transaction history list
Route::get('transaction/history-list',[TransactionController::class,'historyTransaction'])
    ->name('transaction.history-list');

Route::resource('types',TypeController::class);
Route::resource('policies',PolicyController::class);

});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
