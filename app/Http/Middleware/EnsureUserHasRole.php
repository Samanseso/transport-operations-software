<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            return redirect()->route('login');
        }

        $userRole = strtoupper((string) ($user->role ?? ''));

        // 'all' allows any authenticated user
        if (in_array('all', $roles, true)) {
            return $next($request);
        }

        $allowedRoles = array_map('strtoupper', $roles);

        if (! in_array($userRole, $allowedRoles, true)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized role access.'], 403);
            }
            abort(403, 'Unauthorized role access.');
        }

        return $next($request);
    }
}
