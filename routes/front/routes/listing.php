<?php

use App\Http\Controllers\ListingItemController;;
use Illuminate\Support\Facades\Route;

Route::prefix('listing')->group(function () {
    Route::get(null, [ListingItemController::class, 'index'])
        ->name('listing.index');

    Route::prefix('{listingItem}')->group(function () {
        Route::get(null, [ListingItemController::class, 'singleByIDOnly'])
            ->name('listing.single');

        Route::get('stats', [ListingItemController::class, 'stats'])
            ->name('listing.single.stats');

        Route::post('contextMenu', [ListingItemController::class, 'contextMenu'])
            ->name('listing.single.context');

        Route::middleware(['auth'])->group(function () {
            Route::post(null, [ListingItemController::class, 'store'])
                ->name('listing.store');

            Route::get('edit', [ListingItemController::class, 'edit'])
                ->name('listing.single.edit')->can('edit', 'listingItem');

            Route::post('edit', [ListingItemController::class, 'editStore'])
                ->name('listing.single.store')->can('edit', 'listingItem');

            Route::post('favorite', [ListingItemController::class, 'toggleFavorite'])
                ->name('listing.single.favorite');

            Route::post('delete', [ListingItemController::class, 'delete'])
                ->name('listing.single.delete');
        });
    });
});
