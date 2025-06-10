<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

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
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
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

    /**
     * Update the user's profile image.
     */
    public function updateImage(Request $request)
    {
        $request->validate([
            'image' => ['required', 'image', 'max:2048']
        ]);

        try {
            $path = $request->file('image')->store('profile-images', 'public');
            
            if (auth()->user()->profile_image) {
                Storage::disk('public')->delete(auth()->user()->profile_image);
            }

            auth()->user()->update(['profile_image' => $path]);

            return back()->with('success', 'Profile image updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update profile image.');
        }
    }

    /**
     * Remove the user's profile image.
     */
    public function removeImage()
    {
        try {
            if (auth()->user()->profile_image) {
                Storage::disk('public')->delete(auth()->user()->profile_image);
                auth()->user()->update(['profile_image' => null]);
            }

            return back()->with('success', 'Profile image removed successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to remove profile image.');
        }
    }
}
