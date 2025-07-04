<?php

namespace App\Http\Middleware;

use App\Http\Resources\User\AuthResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaAdminRequests extends Middleware
{

    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'admin';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [

            'auth' => [
                'user' => Auth::check() ? new AuthResource($request->user()) : $request->user(),
            ],

            'flash' => [
                'message' => fn() => $request->session()->get('message'),
            ],

            // Send global lang object to frontend, fallback to en if key doesn't exist
            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy(['admin']))->toArray(), [
                    'location' => $request->url(),
                ]);
            },
        ]);
    }

}
