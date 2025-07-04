<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!Auth::check()) {
            return redirect('login');
        }

        $user = Auth::user();

        // Super admin can access everything
        if ($user->hasRole('super-admin')) {
            return $next($request);
        }

        // Check specific role
        if ($role !== 'any' && !$user->hasRole($role)) {
            abort(403, 'Unauthorized action.');
        }

        // Check if user has any admin role
        if ($role === 'any' && !($user->hasRole('admin') || $user->hasRole('moderator'))) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
