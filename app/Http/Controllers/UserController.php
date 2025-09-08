<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles')->whereNot('id', Auth::user()->id)->get();

        $users->transform(function ($user) {
            $user->role = $user->roles->pluck('name')->first() ?? 'No Role';
            unset($user->roles);
            return $user;
        })->toArray();

        return Inertia::render('users/index', ['users' => $users]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::all();

        return Inertia::render('users/create', [
            'roles' => $roles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'              => ['required', 'string', 'min:2', 'max:255'],
            'email'             => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password'          => ['required', 'string', 'min:6', 'confirmed'],
            'role'          => ['required', 'string', 'exists:roles,name'],
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole($validated['role']);

        return redirect()->route('users.index')
                     ->with('success', 'User has been created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::findOrFail($id);
        $roles = Role::all();

        return Inertia::render('users/edit', [
            'user' => $user,
            'roles' => $roles
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->route('users.index')
                        ->with('success', 'User has been updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()
            ->route('users.index')
            ->with('success', 'User has been deleted successfully.');
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids', []);

        if (!empty($ids)) {
            User::whereIn('id', $ids)->delete();
        }

        return back()->with('success', count($ids) . ' User deleted successfully.');
    }

    public function showDeleted()
    {
        $users = User::with('roles')->onlyTrashed()->get();

        $users->transform(function ($user) {
            $user->role = $user->roles->pluck('name')->first() ?? 'No Role';
            unset($user->roles);
            return $user;
        })->toArray();

        return Inertia::render('users/deleted', ['users' => $users]);
    }

    public function restore($id)
    {
        User::withTrashed()->find($id)->restore();
        return back()->with('success', 'User restored successfully.');
    }

    public function forceDelete(Request $request)
    {
        $ids = $request->input('ids', []);

        if (!empty($ids)) {
            User::whereIn('id', $ids)->forceDelete();
        }

        return back()->with('success', count($ids) . ' Users has been successfully deleted permanently.');
    }
}
