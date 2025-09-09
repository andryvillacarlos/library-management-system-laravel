<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Http\Resources\MemberResource;
use App\Http\Resources\TransactionResource;
use App\Models\Book;
use App\Models\Fine;
use App\Models\Member;
use App\Models\Type;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;
class TransactionController extends Controller
{
   public function borrowList() {
            
            $search = request()->input('search');
            $typeId = request()->input('type_id', 'all'); // Default: all types

            $query = Transaction::with(['member.type.policy', 'book'])
                        ->where('status', 'borrowed'); // Only borrowed transactions

            // 🔍 Apply search filter if provided
            if ($search) {
                $query->where(function($query) use ($search) {
                    $query->whereHas('member', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhereHas('book', function ($q) use ($search) {
                        $q->where('title', 'like', "%{$search}%");
                    });
                });
            }

            // 📌 Apply type filter if provided (not "all")
            if ($typeId !== 'all') {
                $query->whereHas('member.type', function ($q) use ($typeId) {
                    $q->where('id', $typeId);
                });
            }
            // Pagination order by borrow date
            $borrows = $query->orderBy('borrow_date', 'desc')
                            ->paginate(10)
                            ->onEachSide(1)
                            ->withQueryString();

            // transform each item safely using through()
            $borrows->through(function ($transaction) {
                $transaction->member_current_borrowed = Transaction::where('member_id', $transaction->member_id)
                                                                ->where('status', 'borrowed')
                                                                ->count();
                $transaction->member_borrow_limit = $transaction->member->type->policy->borrow_limit ?? 0;
                return $transaction;
            });

            return inertia('Borrow/ListBorrow', [
                'borrows' => TransactionResource::collection($borrows),
                'filters' => request()->only(['search', 'type_id']),
                'types'   => Type::all(),
            ]);
  }

 // Borrow Form  

  public function borrowForm(){
            
            // Get the Member info, type and policy
            $members = Member::with('type.policy')->get();

            // Add current borrowed count to each member
            $members = $members->map(function($member) {
                $member->current_borrowed = Transaction::where('member_id', $member->id)
                    ->where('status', 'borrowed')->count();
                return $member;
            });

            return inertia('Borrow/BorrowBook', [
                'members' => MemberResource::collection($members),
                'books' => Book::all(),
            ]);
}




public function borrowBook(StoreTransactionRequest $request) {
            $validated = $request->validated();

            $memberId = $validated['member_id'];
            $bookId   = $validated['book_id'];

            // Fetch member with policy
            $member = Member::with('type.policy')->find($memberId);
            if (!$member) {
                throw ValidationException::withMessages([
                    'member_id' => 'Member not found.',
                ]);
            }

            $policy = $member->type->policy ?? null;
            if (!$policy) {
                throw ValidationException::withMessages([
                    'member_id' => 'Policy not found for this member.',
                ]);
            }

            // Check unpaid fines
            $hasUnpaidFine = Fine::whereHas('transaction', function ($query) use ($memberId) {
                    $query->where('member_id', $memberId);
                })
                ->where('is_paid', 0)
                ->exists();

            if ($hasUnpaidFine) {
                throw ValidationException::withMessages([
                    'member_id' => 'This member has unpaid fines and cannot borrow a book.',
                ]);
            }

            // Check borrow limit
            $currentBorrowed = Transaction::where('member_id', $memberId)
                ->where('status', 'borrowed')
                ->count();

            if ($currentBorrowed >= $policy->borrow_limit) {
                throw ValidationException::withMessages([
                    'member_id' => 'Borrow limit reached.',
                ]);
            }

            // Prevent duplicate borrow of same book
            $alreadyBorrowed = Transaction::where('member_id', $memberId)
                ->where('book_id', $bookId)
                ->where('status', 'borrowed')
                ->exists();

            if ($alreadyBorrowed) {
                throw ValidationException::withMessages([
                    'book_id' => 'This member has already borrowed this book.',
                ]);
            }

            // Check book availability
            $book = Book::find($bookId);
            if (!$book || $book->copies <= 0) {
                throw ValidationException::withMessages([
                    'book_id' => 'Book is not available.',
                ]);
            }

            // Always use Asia/Manila timezone
            $timezone   = 'Asia/Manila';
            $borrowDate = now($timezone);
            $dueDate    = $borrowDate->copy()->addDays($policy->due_days);

            // Create transaction
            Transaction::create([
                'member_id'   => $memberId,
                'book_id'     => $bookId,
                'borrow_date' => $borrowDate->format('Y-m-d H:i:s'),
                'return_date' => $dueDate->format('Y-m-d H:i:s'),
                'status'      => 'borrowed',
            ]);

            // Update book copies
            $book->decrement('copies');
            $book->status = $book->copies <= 0 ? 'not available' : 'available';
            $book->save();

            return redirect()
                ->route('transaction.borrow.list')
                ->with('success', 'Book borrowed successfully.');
}


public function markAsReturned(Transaction $transaction){
            
            // Check if this books already return
            if ($transaction->status !== 'borrowed') {
                return back()->with('error', 'This book has already been returned.');
            }
            
            // Update the books database
            $transaction->update([
                'status' => 'returned',
                'return_date' => now()->toDateString(),
            ]);
        
            // Find the book id that matches transaction book id data
            $book = Book::find($transaction->book_id);
            
            // Update the copies and status
        
            if($book){
                $book->copies += 1;
                $book->status = $book->copies > 0 ? 'available' : 'not available';
                $book->save();
            }

        return redirect()->route('transaction.borrow.list')->with('success','Return Successfully');
}

public function historyTransaction(Request $request) {
    
            // Get the search input
            $search = $request->get('search');
            // Get the status input
            $status = $request->get('status', 'all');
            
            // Search in corresponding data in database
            $history = Transaction::with(['book','member'])
                ->when($search, function ($query, $search) {
                    $query->whereHas('member', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhereHas('book', function ($q) use ($search) {
                        $q->where('title', 'like', "%{$search}%")
                        ->orWhere('author', 'like', "%{$search}%");
                    });
                })
                ->when($status !== 'all', function ($query) use ($status) {
                    $query->where('status', $status);
                })
                ->whereBetween('created_at', [Carbon::now()->subDays(7), Carbon::now()]) // 7 days filter
                ->paginate(10)
                ->appends($request->all())
                ->onEachSide(1);

            return inertia('History/HistoryList', [
                'transactionHistory' => $history,
                'filters' => [
                    'search' => $search,
                    'status' => $status,
                ],
                'statuses' => ['all', 'borrowed', 'returned', 'overdue'],
            ]);
}

    public function deleteTransaction(){
       Transaction::where('created_at','<',Carbon::now()->subDays(7))->delete();
       
    }

}
