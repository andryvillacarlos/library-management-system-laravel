<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Http\Resources\MemberResource;
use App\Http\Resources\TransactionResource;
use App\Models\Book;
use App\Models\Member;
use App\Models\Type;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        //
    }


    public function borrowList()
{
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

   
public function borrowForm()
{
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



public function borrowBook(StoreTransactionRequest $request)
{
    $validated = $request->validated();
    $memberId = $validated['member_id'];
    $bookId   = $validated['book_id'];

    // Fetch member with policy
    $member = Member::with('type.policy')->find($memberId);
    if (!$member) {
        return back()->with('error', 'Member not found');
    }

    $policy = $member->type->policy ?? null;
    if (!$policy) {
        return back()->with('error', 'Policy not found for this member');
    }

    // Check borrow limit
    $currentBorrowed = Transaction::where('member_id', $memberId)
        ->where('status', 'borrowed')
        ->count();

    if ($currentBorrowed >= $policy->borrow_limit) {
        return back()->with('error', 'Borrow limit reached');
    }

    // Prevent duplicate borrow of same book
    $alreadyBorrowed = Transaction::where('member_id', $memberId)
        ->where('book_id', $bookId)
        ->where('status', 'borrowed')
        ->exists();

    if ($alreadyBorrowed) {
        return back()->with('error', 'This member has already borrowed this book.');
    }

    // Check book availability
    $book = Book::find($bookId);
    if (!$book || $book->copies <= 0) {
        return back()->with('error', 'Book is not available');
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


   public function markAsReturned(Transaction $transaction)
   {
    if ($transaction->status !== 'borrowed') {
        return back()->with('error', 'This book has already been returned.');
    }

    $transaction->update([
        'status' => 'returned',
        'return_date' => now()->toDateString(),
    ]);

   $book = Book::find($transaction->book_id);

   if($book){
     $book->copies += 1;
     $book->status = $book->copies > 0 ? 'available' : 'not available';
     $book->save();
   }

   return redirect()->route('transaction.borrow.list')->with('success','Return Successfully');
}

public function historyTransaction(Request $request)
{
    $search = $request->get('search');
    $status = $request->get('status', 'all'); // only status filter now

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
        ->paginate(10)
        ->appends($request->all())
        ->onEachSide(1);

    return inertia('History/HistoryList', [
        'transactionHistory' => $history,
        'filters' => [
            'search' => $search,
            'status' => $status,
        ],
        'statuses' => ['all', 'borrowed', 'returned', 'overdue'], // dropdown options
    ]);
}



}
