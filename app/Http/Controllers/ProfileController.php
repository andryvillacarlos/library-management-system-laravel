<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
  public function edit(Request $request): Response
{
    return Inertia::render('Profile/Edit', [
        'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
        'status' => session('status'),
        'auth' => [
            'user' => $request->user() // profile_pic is just the filename
        ],
    ]);
}

    /**
     * Update the user's profile information.
     */
public function update(ProfileUpdateRequest $request)
{
    $user = $request->user();
    $data = $request->validated();

    // Handle profile picture upload
    if ($request->hasFile('profile_picture')) {
        $file = $request->file('profile_picture');

        // Generate a unique filename to avoid conflicts
        $fileName = time() . '_' . $file->getClientOriginalName();

        // Optional: delete old profile picture if exists
        if ($user->profile_pic && Storage::disk('public')->exists("profile_pics/{$user->profile_pic}")) {
            Storage::disk('public')->delete("profile_pics/{$user->profile_pic}");
        }

        // Store file in public disk
        $file->storeAs('profile_pics', $fileName, 'public');

        // Save the new filename to the database
        $data['profile_pic'] = $fileName;
    }





    // Update user
    $user->update($data);

    return back()->with('status', 'profile-updated');
}




    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
