<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Front extends Middleware
{

    public function handle($request, Closure $next, ...$guards)
    {
        if ($request->getHost() === env('ADMIN_URL')) {
            abort(404);
        }

        return parent::handle($request, $next, $guards);
    }

}
