<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Http\Resources\MemberResource;
use App\Http\Resources\TransactionResource;
use App\Models\Book;
use App\Models\Member;
use App\Models\Policy;
use Carbon\Carbon;

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

    $query = Transaction::with(['member.type.policy', 'book'])
                ->where('status', 'borrowed'); // Only borrowed transactions

    // Apply search filter if provided
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

    $borrows = $query->orderBy('borrow_date', 'desc')
                     ->paginate(10)
                     ->onEachSide(1)
                     ->withQueryString();

    // Add current borrowed count and borrow limit for each member
    $borrows->getCollection()->transform(function ($transaction) {
        $transaction->member_current_borrowed = Transaction::where('member_id', $transaction->member_id)
                                                          ->where('status', 'borrowed')
                                                          ->count();
        $transaction->member_borrow_limit = $transaction->member->type->policy->borrow_limit ?? 0;
        return $transaction;
    });

    return inertia('Borrow/ListBorrow', [
        'borrows' => TransactionResource::collection($borrows),
        'filters' => [
            'search' => $search,
        ],
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
    $bookId = $validated['book_id'];

    // Fetch member with their policy
    $member = Member::with('type.policy')->find($memberId);
    if (!$member) {
        return redirect()->back()->with('error', 'Member not found');
    }

    $policy = $member->type->policy ?? null;
    if (!$policy) {
        return redirect()->back()->with('error', 'Policy not found for this member');
    }

    // Check borrow limit
    $currentBorrowed = Transaction::where('member_id', $memberId)
                        ->where('status', 'borrowed')
                        ->count();

    if ($currentBorrowed >= $policy->borrow_limit) {
        return redirect()->back()->with('error', 'Borrow limit reached');
    }

    // Check if member already borrowed this book
    $alreadyBorrowed = Transaction::where('member_id', $memberId)
                        ->where('book_id', $bookId)
                        ->where('status', 'borrowed')
                        ->exists();

    if ($alreadyBorrowed) {
        return redirect()->back()->with('error', 'This member has already borrowed this book.');
    }

    // Check book availability
    $book = Book::find($bookId);
    if (!$book || $book->copies <= 0) {
        return redirect()->back()->with('error', 'Book is not available');
    }

    // Parse borrow date from frontend or use current datetime
    $borrowDate = isset($validated['borrow_date'])
        ? Carbon::parse($validated['borrow_date'])->format('Y-m-d H:i:s')
        : now()->format('Y-m-d H:i:s');

    // Calculate due date based on policy
    $dueDate = Carbon::now()->addDays($policy->due_days)->format('Y-m-d H:i:s');

    // Create transaction
    Transaction::create([
        'member_id' => $memberId,
        'book_id' => $bookId,
        'borrow_date' => $borrowDate,
        'due_date' => $dueDate,
        'status' => 'borrowed',
    ]);

    // Update book copies
    $book->copies = max(0, $book->copies - 1);
    $book->status = $book->copies === 0 ? 'not available' : 'available';
    $book->save();

    return redirect()->route('transaction.borrow.list')->with('success', 'Book borrowed successfully.');
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

}
