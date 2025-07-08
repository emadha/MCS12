<?php

use App\Http\Controllers\ActionsController;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\Api\ApiListingController;
use App\Http\Controllers\Api\Shop\ApiShopController;
use App\Http\Controllers\CarsDatabaseController;
use App\Http\Controllers\ContextMenuController;
use App\Http\Controllers\ListingItemsCarController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::get('user', function (Request $request) {
        return $request->user();
    });

    Route::prefix('actions')->group(function () {
        Route::prefix('item')->group(function () {
            Route::post(null, [ActionsController::class, 'action'])
                ->name('actions.item');

            Route::post('favorite', [ActionsController::class, 'favorite'])
                ->name('actions.item.favorite');
        });
    });

    Route::prefix('my')->group(function () {
        Route::get('cars', [UserController::class, 'myCars']);
        Route::get('shops', [UserController::class, 'myShops']);
        Route::get('showrooms', [UserController::class, 'myShowrooms']);
    });
});

Route::prefix('users')->group(function () {
    Route::post('search', [UserController::class, 'search'])
        ->name('api.user.search');
});

Route::post('searchDefaults', [SearchController::class, 'defaultCriteria'])
    ->name('api.search.defaults');

Route::post('changeLocale', function (Request $request) {
    app()->setLocale($request->get('locale'));

    return (new Response([
        'lang' => [...__('frontend', [], 'en'), ...__('frontend')],
        'rtl' => app()->isLocale('ar'),
        'locale' => $request->get('locale'),
    ]))->withCookie(cookie('locale', $request->get('locale'), 1000));
})->name('locale.change');

Route::post('places', function (Request $request) {
    $url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
        . $request->get('latlng')
        . '&key=' . env('GOOGLE_MAPS_API_KEY');
    try {
        $Http = Http::get($url);

        $body = json_decode($Http->body());
        $results = $body->results;

        return response($results)
            ->header('Content-Type', 'application/json');
    } catch (Exception $exception) {
        return response('Bad Request ' . $exception->getMessage(), 400);
    }
})->name('geocode');
Route::get('related/{listingItem}/{type}', [ListingItemsCarController::class, 'getRelatedToItem']);

Route::prefix('cars')->group(function () {
    // Get the Makes
    Route::post(null, [CarsDatabaseController::class, 'getAllMakes'])
        ->name('api.cars.makes');

    Route::prefix('{makes}')->group(function () {
        // Get the Models
        Route::post(null, [CarsDatabaseController::class, 'byMake'])
            ->name('api.cars.makes.models');

        // Prefix the Models for null to get the Series
        Route::prefix('{models}')->group(function () {
            Route::post(null, [CarsDatabaseController::class, 'byMakeAndModel'])
                ->name('api.cars.makes.models.series');

            Route::prefix('{series}')->group(function () {
                Route::post(null, [CarsDatabaseController::class, 'byMakeAndModelAndSeries'])
                    ->name('api.cars.makes.models.series.trims');
            });
        });
    });
});

Route::get('showrooms', [ApiController::class, 'showrooms'])->name('api.showrooms');
Route::post('contextMenu', [ContextMenuController::class, 'getContextMenuByItem'])->name('contextMenu');

Route::prefix('shops')->group(function () {

    Route::get(null, [ApiShopController::class, 'shops'])
        ->name('api.shops.index');

    Route::prefix('{shop}')->group(function () {
        Route::prefix('stats')->group(function () {
            Route::get('visits', [ApiController::class, 'shopStats'])->name('shop.stats.visits.graph');
        });
    });
});
Route::get('shops/{shop_id}/listings/cars', [ShopController::class, 'listings_cars'])
    ->name('api.shop.listings');

Route::get('listing/shop', [ApiListingController::class, 'listingShop'])->name('api.listing.shop');
