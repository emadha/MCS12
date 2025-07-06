<?php

namespace App\Providers;

use App\Models\ListingItem;
use App\Models\MessageBoard;
use App\Models\Session;
use App\Models\Shop;
use App\Models\ShopType;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{

    const ALLOWED_LANGUAGES = ['ar', 'en', 'sv', 'fr'];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        $localeCookie = Cookie::get('locale');

        if ($localeCookie && in_array($localeCookie, self::ALLOWED_LANGUAGES)) {
            app()->setLocale($localeCookie);
        } elseif (count(request()->getLanguages())) { // Set language from browser if no cookie is found
            app()->setLocale(request()->getLanguages()[0]);
        }

        if (app()->environment('production')) {
            Debugbar::disable();
        }


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

        if (request()->hasSession()) {
            Session::find(request()->session());
        }

        $this->configureRateLimiting();
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
