<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Member;
use App\Models\TrackHistory;
use App\Models\Transaction;
use Carbon\Carbon;


class DashboardController extends Controller
{
    public function allData(){
        // Sum of all copies book
        $bookCount = Book::sum('copies');
        // All active member count
        $memberCount = Member::count();
        // Borrow book today
        $borrowBookToday = TrackHistory::where('action','borrowed') // Only status is borrowed.
                           ->whereDate('action_date',Carbon::now())// Only today.
                           ->count();// Count
        // Count overdue books.
        $overDueBooks = Transaction::where('status','borrowed')
                                    ->whereDate('return_date','<',Carbon::today())
                                    ->count();
        // Count member add this week.
        $membersCountThisWeek = Member::whereBetween('created_at',[
             Carbon::now()->startOfWeek(),
             Carbon::now()->endOfWeek(),
        ])->count();
         
        // Count borrow books this week.
        $booksBorrowCountThisWeek = TrackHistory::where('action','borrowed')
                                               ->whereBetween('action_date',[
                                                  Carbon::now()->startOfWeek(),
                                                  Carbon::now()->endOfWeek(),  
                                               ])->count();
        // Count all data that has range of borrow date in 7 months before.
        $borrowBookLast7Months = TrackHistory::selectRaw("DATE_FORMAT(borrow_date, '%Y-%m') as month, COUNT(*) as total") // Get only the year and month format 2025-09.
        ->where('action', 'borrowed') // Where the status is borrowed
        ->where('borrow_date', '>=', Carbon::now()->subMonths(7)) // Get all the data with the borrow date is range from 7 months before.
        ->groupBy('month')
        ->orderBy('month')
        ->pluck('total', 'month');

        $weeklyBorrowedReturnActivity = TrackHistory::selectRaw('DATE(action_date) as day, action, COUNT(*) as total')
        ->whereBetween('action_date', [
            Carbon::now()->startOfWeek(), 
            Carbon::now()->endOfWeek()
        ])
        ->whereIn('action', ['borrowed', 'returned']) // only count borrowed/returned
        ->groupBy('day', 'action')
        ->orderBy('day')
        ->get()
        ->groupBy('day');

        return inertia('Dashboard',[
            'bookCount' => number_format($bookCount),
            'memberCount' => number_format($memberCount),
            'borrowBookToday' => number_format($borrowBookToday),
            'overDueBooks' => number_format($overDueBooks),
            'membersCountThisWeek' => number_format($membersCountThisWeek),
            'booksBorrowCountThisWeek' => number_format($booksBorrowCountThisWeek),
            'borrowBookLast7Months' => $borrowBookLast7Months,
            'weeklyBorrowedReturnActivity' => $weeklyBorrowedReturnActivity,
        ]);
    }
}
