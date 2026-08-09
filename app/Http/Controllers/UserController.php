<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use App\Models\SystemLog;

class UserController extends Controller
{
    public function customer()
    {
        $search = trim((string) request()->query('q', ''));
        $query = User::where('role', 'CUSTOMER')
            ->select('id', 'name', 'email', 'created_at', 'updated_at');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%')
                    ->orWhere('id', 'like', '%'.$search.'%');
            });
        }

        return Inertia::render('admin/users', [
            'users' => $query->paginate(20)->withQueryString(),
            'filters' => [
                'q' => $search,
            ],
        ]);
    }

    public function driver()
    {
        $search = trim((string) request()->query('q', ''));
        $query = User::where('role', 'DRIVER')
            ->select('id', 'name', 'email', 'created_at', 'updated_at');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%')
                    ->orWhere('id', 'like', '%'.$search.'%');
            });
        }

        return Inertia::render('admin/users', [
            'users' => $query->paginate(20)->withQueryString(),
            'filters' => [
                'q' => $search,
            ],
        ]);
    }

    public function admin()
    {
        $search = trim((string) request()->query('q', ''));
        $query = User::where('role', 'ADMINISTRATOR')
            ->select('id', 'name', 'email', 'created_at', 'updated_at');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%')
                    ->orWhere('id', 'like', '%'.$search.'%');
            });
        }

        return Inertia::render('admin/users', [
            'users' => $query->paginate(20)->withQueryString(),
            'filters' => [
                'q' => $search,
            ],
        ]);
    }

    public function show(User $user)
    {
        return response()->json($user);
    }

    public function create(Request $request)
    {
        if (strtoupper((string) $request->user()?->role) !== 'ADMINISTRATOR') {
            abort(403, 'Only administrators can create users or assign roles.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'string', Rule::in(['ADMINISTRATOR', 'DRIVER', 'CUSTOMER'])],
            'contact_number' => ['nullable', 'string', 'max:50'],
            'license_number' => ['nullable', 'string', 'max:50'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => strtoupper($validated['role']),
        ]);

        if (strtoupper($validated['role']) === 'DRIVER') {
            $driverId = 'DRV-' . sprintf('%04d', $user->id);
            \App\Models\Driver::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'driver_id' => $driverId,
                    'contact_number' => $request->input('contact_number') ?: '09170000000',
                    'license_number' => $request->input('license_number') ?: 'N/A',
                    'status' => 'AVAILABLE',
                ]
            );
        }

        SystemLog::create([
            'datelog' => now()->toDateString(),
            'timelog' => now()->format('H:i:s'),
            'action' => 'ADD',
            'module' => 'USERS',
            'performed_to' => (string) $user->id,
            'description' => 'User record for '.$user->name.' was created with role '.$user->role.'.',
        ]);

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "create",
            'modal_title' => "User created!",
            'modal_message' => "User #" . $user->id . " was created successfully.",
        ]);
    }

    public function update(Request $request, User $user)
    {
        if (strtoupper((string) $request->user()?->role) !== 'ADMINISTRATOR') {
            abort(403, 'Only administrators can modify user roles or credentials.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'role' => ['required', 'string', Rule::in(['ADMINISTRATOR', 'DRIVER', 'CUSTOMER'])],
        ]);

        $oldRole = $user->role;
        $newRole = strtoupper($validated['role']);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $newRole,
            'updated_at' => now(),
        ]);

        // Revoke all active API Sanctum bearer tokens immediately if role changed or account edited
        if ($oldRole !== $newRole) {
            $user->tokens()->delete();
        }

        SystemLog::create([
            'datelog' => now()->toDateString(),
            'timelog' => now()->format('H:i:s'),
            'action' => 'UPDATE',
            'module' => 'USERS',
            'performed_to' => (string) $user->id,
            'description' => 'User #'.$user->id.' profile updated. Tokens revoked if role changed.',
        ]);

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => "User updated!",
            'modal_message' => "User #" . $user->id . " was updated successfully.",
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        if (strtoupper((string) $request->user()?->role) !== 'ADMINISTRATOR') {
            abort(403, 'Only administrators can delete user accounts.');
        }

        // Revoke tokens immediately before soft deleting
        $user->tokens()->delete();
        $user->delete();

        SystemLog::create([
            'datelog' => now()->toDateString(),
            'timelog' => now()->format('H:i:s'),
            'action' => 'DELETE',
            'module' => 'USERS',
            'performed_to' => (string) $user->id,
            'description' => 'User #'.$user->id.' account was soft-deleted and all tokens revoked.',
        ]);

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "delete",
            'modal_title' => "User deleted!",
            'modal_message' => "User #" . $user->id . " was deleted successfully.",
        ]);
    }   
}
