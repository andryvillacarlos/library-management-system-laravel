<?php

namespace App\Http\Controllers;

use App\Models\Fine;
use App\Http\Requests\StoreFineRequest;
use App\Http\Requests\UpdateFineRequest;
use App\Http\Resources\FineResource;
use Illuminate\Support\Carbon;
use App\Models\Transaction;
use App\Models\Type;
use Illuminate\Http\Request;

class FineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $fines = Fine::with('transaction');
        
        return inertia('Fines/FineList',[
            'fines' => FineResource::collection($fines),
        ]);
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
    public function store(StoreFineRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Fine $fine)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Fine $fine)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFineRequest $request, Fine $fine)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Fine $fine)
    {
        //
    }

        public function generateFines()
        {
            $today = Carbon::today();

            // find transactions that are overdue, have status 'borrowed', and don’t have a fine yet
            $overdueTransactions = Transaction::where('return_date', '<', $today)
                ->where('status', 'borrowed') // filter only borrowed transactions
                ->doesntHave('fine')
                ->get();

            foreach ($overdueTransactions as $transaction) {
                // calculate days late
                $daysLate = Carbon::parse($transaction->return_date)->diffInDays($today);

                // Example: 10 pesos per day late
                $fineAmount = $daysLate * 10;

                Fine::create([
                    'transaction_id' => $transaction->id,
                    'amount'         => $fineAmount,
                    'is_paid'        => false,
                ]);
            }
        }



public function fineList(Request $request)
{
    $search  = $request->get('search');
    $type_id = $request->get('type_id', 'all'); // default to "all"

    $fines = Fine::with(['transaction.member.type'])
        ->when($search, function ($query, $search) {
            $query->whereHas('transaction.member', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        })
        ->when($type_id !== 'all', function ($query) use ($type_id) {
            $query->whereHas('transaction.member', function ($q) use ($type_id) {
                $q->where('type_id', $type_id);
            });
        })
        ->paginate(10)
        ->withQueryString();

    return inertia('Fines/FineList', [
        'fines'   => FineResource::collection($fines), // keep paginator intact
        'filters' => $request->only('search', 'type_id'),
        'types'   => Type::all(['id', 'name']), // for dropdown in FineTopBar
    ]);
}

public function markAsPaid(Fine $fine)
{
    if (!$fine->is_paid) {
        $fine->update(['is_paid' => true]);
    }

    return back()->with('success', 'Fine marked as paid.');
}

}



    

