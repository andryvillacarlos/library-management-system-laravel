<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Member;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function allData(){
        
        $bookCount = Book::sum('copies');
        $memberCount = Member::count();
        $borrowBookToday = Transaction::where('status','borrowed')
                           ->whereDate('borrow_date',Carbon::now())
                           ->count();
        $overDueBooks = Transaction::where('status','borrowed')
                                    ->where('return_date','<',Carbon::now())
                                    ->count();

        $borrowBookLast7Months = Transaction::selectRaw("DATE_FORMAT(borrow_date, '%Y-%m') as month, COUNT(*) as total")
        ->where('status', 'borrowed')
        ->where('borrow_date', '>=', Carbon::now()->subMonths(7))
        ->groupBy('month')
        ->orderBy('month')
        ->pluck('total', 'month');

        return inertia('Dashboard',[
            'bookCount' => number_format($bookCount),
            'memberCount' => number_format($memberCount),
            'borrowBookToday' => number_format($borrowBookToday),
            'overDueBooks' => number_format($overDueBooks),
            'borrowBookLast7Months' => $borrowBookLast7Months,
        ]
            
        );
    }
}
