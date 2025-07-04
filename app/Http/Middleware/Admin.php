<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Admin extends Middleware
{

    public function handle($request, Closure $next, ...$guards)
    {
        if (!Auth::check() || !$request->user()?->can('access_backend', $request->user())) {
            abort(Response::HTTP_UNAUTHORIZED);
        }

        return parent::handle($request, $next, $guards);
    }

}
