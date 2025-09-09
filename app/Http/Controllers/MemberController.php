<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Http\Requests\StoreMemberRequest;
use App\Http\Requests\UpdateMemberRequest;
use App\Http\Resources\MemberResource;
use App\Models\Type;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index()
{
    $search   = request()->input('search');
    $status   = request()->input('status', 'all'); // for future use
    $typeId   = request()->input('type_id');       // 👈 type filter

    $query = Member::query();

    // 🔍 Search filter
    if ($search) {
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%")
              ->orWhere('phone', 'like', "%{$search}%")
              ->orWhere('address', 'like', "%{$search}%");
        });
    }

    // 🎯 Type filter
    if ($typeId && $typeId !== 'all') {
        $query->where('type_id', $typeId);
    }

    $members = $query->with('type')->paginate(10)->onEachSide(1);

    return inertia('Member/MemberList', [
        'members' => MemberResource::collection($members),
        'filters' => [
            'search'  => $search,
            'status'  => $status,
            'type_id' => $typeId, // 👈 keep filter state
        ],
        'types' => Type::all(),
    ]);
}


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    
       return inertia('Member/MemberAdd',[
        'types' => Type::all(),
       ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMemberRequest $request)
    {
        $validated = $request->validated();
        Member::create($validated);
        return redirect()->route('members.index')->with('success', 'Successfully add member');
    }

    /**
     * Display the specified resource.
     */
    public function show(Member $member)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Member $member)
    {
         return inertia('Member/EditMember',[
            "member" => $member, 
            "types" => Type::all(),
         ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMemberRequest $request, Member $member)
    {
        $validated = $request->validated();
        $member->update($validated);
        return redirect()->route('members.index')->with('success', 'Edit successfully!!');
    }

    /**
     * Remove the specified resource from storage.
     */
   public function destroy(Member $member)
    {
    // Check if the member has any active/unreturned transactions
    $hasActiveTransactions = $member->transactions()
        ->where('status','borrowed') // adjust column name if needed
        ->exists();

    if ($hasActiveTransactions) {
        return redirect()
            ->route('members.index')
            ->with('error', "{$member->name} cannot be deleted because they still have unreturned transactions.");
    }

    // Check if the member has any unpaid fines
    $hasUnpaidFines = $member->fines()
        ->where('is_paid', false)
        ->exists();

    if ($hasUnpaidFines) {
        return redirect()
            ->route('members.index')
            ->with('error', "{$member->name} cannot be deleted because they still have unpaid fines.");
    }

    // Safe to delete
    $member->delete();

    return redirect()
        ->route('members.index')
        ->with('success', "Member {$member->name} deleted successfully.");
}


}
