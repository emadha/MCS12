<?php

use App\Http\Controllers\ListingItemController;
use App\Http\Controllers\ListingItemsCarController;
use Illuminate\Support\Facades\Route;

Route::prefix('listing/cars')->group(function () {
    Route::middleware(['verified'])->group(function () {
        Route::get('submit', [ListingItemsCarController::class, 'form'])
            ->name('listing.car.submit');

        Route::post('submit', [ListingItemsCarController::class, 'store'])
            ->name('listing.car.submit.post');
    });

    Route::prefix('{condition}')->group(function () {
        Route::prefix('{listing_frontend}')->group(function () {

            Route::get(null, [ListingItemsCarController::class, 'single'])
                ->name('listing.cars.single');
        });
    });

    Route::post(null, [ListingItemController::class, 'store'])
        ->name('listing.cars.store');

    Route::get('edit', [ListingItemsCarController::class, 'edit'])
        ->name('listing.cars.single.edit')->can('edit', 'listingItem');

    Route::post('edit', [ListingItemsCarController::class, 'store'])
        ->name('listing.cars.single.store');
});
