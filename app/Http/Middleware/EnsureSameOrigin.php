<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSameOrigin
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        // Disallow visits without referer
        $disallowDirectVisit = false;

        // Check if the request is from the same origin
        $referer = $request->headers->get('referer');
        $host = $request->headers->get('host');

        // If no referer is set, or if the referer contains the same host, proceed
        if (!$disallowDirectVisit || str_contains($referer, $host)) {
            return $next($request);
        }

        // Otherwise, reject the request
        return response()->json(['message' => 'Forbidden: Cross-origin requests are not allowed'], 403);
    }
}
