<?php

namespace App\Exceptions;

use App\Http\Resources\User\AuthResource;
use App\Http\Resources\User\UserResource;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class Handler extends ExceptionHandler
{

    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels
        = [
            //
        ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport
        = [
            //
        ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash
        = [
            'current_password',
            'password',
            'password_confirmation',
        ];

    public function render($request, Throwable $e)
    {
        $response = parent::render($request, $e);
        $statusCode = $response->getStatusCode();

        switch ($statusCode) {
            case Response::HTTP_SERVICE_UNAVAILABLE:
            {
                $data = [
                    'title'   => __('frontend.Service Unavailable at the moment'),
                    'auth'    => [
                        'user' => null,
                    ],
                    'lang'    => [...__('frontend', locale: 'en'), ...__('frontend')],
                    'refresh' => $response?->headers?->get('refresh') ?? -1,
                ];

                View::share($data);

                return Inertia::render('Errors/Error503', $data)
                    ->toResponse($request)->setStatusCode(503);
            }

            case Response::HTTP_NOT_FOUND :
            {
                $data = [
                    'auth'  => [
                        'user' => Auth::check() ? new AuthResource($request->user()) : $request->user(),
                    ],
                    'title' => 'Page not found',
                    'lang'  => [...__('frontend', locale: 'en'), ...__('frontend')],
                ];

                View::share($data);

                return Inertia::render('Errors/NotFound', $data)
                    ->toResponse($request)
                    ->setStatusCode(404);
            }

            case Response::HTTP_UNAUTHORIZED:
            {
                $View = 'Errors/NotAuthorized';

                $data = [
                    'auth'  => [
                        'user' => Auth::check() ? new AuthResource($request->user()) : $request->user(),
                    ],
                    'title' => 'Unauthorized',
                    'lang'  => [...__('frontend', locale: 'en'), ...__('frontend')],
                ];

                if ($request->route()->domain() === env('ADMIN_URL')) {
                    // Set Inertia Root view to use admin
                    //  because in Kernel, you set the web group to use front
                    //  and in admin view you set 'admin' inertial,
                    //  but here for exception inertia reverts back to front view instead of admin view.
                    //  so, in short, we force set it to admin.blade.php if domain is admin.
                    Inertia::setRootView('admin');

                    if ($request->get('_k') === env('ADMIN_KEY')) {
                        $data['_k'] = 'success';
                    }
                }

                View::share($data);

                return Inertia::render($View, $data);
            }
            case 419:
            {
                return back()->with(['error' => 'Invalid Token Request #'.__LINE__])->setStatusCode(Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            default:
            {
                return $response;
            }
        }
    }

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

}
