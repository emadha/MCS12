<?php

namespace App\Providers;

use App\Models\ListingItem;
use App\Models\MessageBoard;
use App\Models\Shop;
use App\Models\ShopType;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/';

    /**
     * Register any application services.
     */
    public function register(): void
    {
        dd('sdie');
        parent::register();
    }

    /**
     * Define your route model bindings, pattern filters, and other route
     * configuration.
     */
    public function boot(): void
    {
        // Configure rate limiting
        $this->configureRateLimiting();

        // Set up custom route bindings
        $this->configureRouteBindings();
    }

    /**
     * Configure custom route bindings.
     */
    protected function configureRouteBindings(): void
    {
        Route::bind('frontend_showroom', function ($frontend_showroom) {
            return Shop::type([ShopType::TYPE_SHOWROOM])
                ->findOrFail($frontend_showroom);
        });

        Route::bind('shop_frontend_page', function ($shop_frontend) {
            /** @var Shop $Shop */
            $Shop = Shop::with([
                'favorites', 'photos', 'user.photos', 'types', 'contacts', 'location',
            ]);

            return $Shop->findOrFail($shop_frontend);
        });

        Route::bind('message_board_uuid', function (string $uuid) {
            $messageBoard = MessageBoard::where(['uuid' => $uuid])
                ->whereHas('participants', function ($builder) {
                    $builder->whereHas('user', function ($q) {
                        $q->id = Auth::id();
                    });
                });

            return $messageBoard->first();
        });

        Route::bind('listing_frontend', function (string $item) {
            $listingItem = ListingItem::with(['photos', 'contacts', 'shop'])
                ->find($item)
                ?->setAppends(['primary_photo', 'cover_photo', 'display']);

            return $listingItem;
        });
    }

    /**
     * Configure the rate limiters for the application.
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(300)
                ->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('profile', function (Request $request) {
            return Limit::perMinute(10)
                ->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('reports', function (Request $request) {
            return Limit::perMinute(10)
                ->by($request->user()?->id ?: $request->ip());
        });
    }
}
