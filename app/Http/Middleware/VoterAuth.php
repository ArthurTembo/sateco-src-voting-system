<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Guards the voter voting flow (login, ballot, thank-you, already-voted
 * pages) with its own session key, separate from the admin `auth` guard.
 */
class VoterAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->session()->has('voter_id')) {
            return redirect()->route('vote.login');
        }

        return $next($request);
    }
}
