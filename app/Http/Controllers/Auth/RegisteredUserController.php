<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'username' => ['nullable', 'string', 'max:255', 'unique:'.User::class],
            'name' => ['nullable', 'string', 'max:255'],
            'first_name' => ['nullable', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $firstName = $request->first_name ?? ($request->name ? preg_split('/\s+/', trim($request->name))[0] ?? '' : '');
        $lastName = $request->last_name ?? ($request->name ? preg_split('/\s+/', trim($request->name), 2)[1] ?? '' : '');
        $fullName = trim(implode(' ', array_filter([
            $request->first_name ?? $firstName,
            $request->middle_name,
            $request->last_name ?? $lastName,
        ], fn ($value) => ! empty($value))));

        $username = $request->username ?? Str::slug($request->email ? Str::before($request->email, '@') : $fullName, '');

        $user = User::create([
            'username' => $username,
            'name' => $fullName,
            'first_name' => $request->first_name ?? $firstName,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name ?? $lastName,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_super_admin' => false,
            'has_voted' => false,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }
}
