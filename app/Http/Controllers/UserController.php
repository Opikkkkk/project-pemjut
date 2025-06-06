<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'username', 'role', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => User::getRoles()
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'username' => 'required|string|max:255|unique:users',
            'role' => 'required|in:Admin,Project Manager,Team Member',
            'password' => 'required|string|min:8|confirmed',
        ]);

        try {
            User::create([
                'name' => $request->name,
                'email' => $request->email,
                'username' => $request->username,
                'role' => $request->role,
                'password' => Hash::make($request->password),
            ]);

            return Redirect::route('users')->with('success', 'User created successfully!');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Failed to create user: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'username' => 'required|string|max:255|unique:users,username,' . $id,
            'role' => 'required|in:Admin,Project Manager,Team Member',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        try {
            $updateData = [
                'name' => $request->name,
                'email' => $request->email,
                'username' => $request->username,
                'role' => $request->role,
            ];

            // Only update password if provided
            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $user->update($updateData);

            return Redirect::route('users')->with('success', 'User updated successfully!');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Failed to update user: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);

            // Prevent deletion of the last admin
            if ($user->isAdmin()) {
                $adminCount = User::where('role', User::ROLE_ADMIN)->count();
                if ($adminCount <= 1) {
                    return Redirect::back()->with('error', 'Cannot delete the last admin user.');
                }
            }

            $user->delete();

            return Redirect::route('users')->with('success', 'User deleted successfully!');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Failed to delete user: ' . $e->getMessage());
        }
    }
}
