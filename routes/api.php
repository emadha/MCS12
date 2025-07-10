<?php

use App\Http\Controllers\Api\ApiListingController;
use App\Http\Controllers\ContextMenuController;
use App\Http\Controllers\ListingItemsCarController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
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

    Route::prefix('my')->group(function () {
        Route::get('cars', [UserController::class, 'myCars']);
        Route::get('shops', [UserController::class, 'myShops']);
        Route::get('showrooms', [UserController::class, 'myShowrooms']);
    });

});

Route::get('reviews', [ReviewController::class, 'index'])->name('api.reviews.index');
Route::post('searchDefaults', [SearchController::class, 'defaultCriteria'])->name('api.search.defaults');
Route::post('changeLocale', [\App\Http\Controllers\Api\ApiController::class, 'changeLocale'])->name('locale.change');

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

Route::get('geocoding', [\App\Http\Controllers\GeocodingController::class, 'reverseGeocode'])->name('api.geocode.reverse');

# Todo These two on bottom need to be organized
Route::get('related/{listingItem}/{type}', [ListingItemsCarController::class, 'getRelatedToItem']);
Route::get('listing/shop', [ApiListingController::class, 'listingShop'])->name('api.listing.shop');

# Todo this should not be in api routs
Route::post('contextMenu', [ContextMenuController::class, 'getContextMenuByItem'])->name('contextMenu');

# Actions
require __DIR__ . '/api/reviews.php';

# Models
require __DIR__ . '/api/cars.php';
require __DIR__ . '/api/shops.php';
