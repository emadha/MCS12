<?php

use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\Api\Shop\ApiShopController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

Route::get('showrooms', [ApiController::class, 'showrooms'])->name('api.showrooms');

Route::prefix('shops')->group(function () {
    Route::get(null, [ApiShopController::class, 'shops'])->name('api.shops.index');
    Route::prefix('{shop}')->group(function () {

        Route::get('listings/cars', [ShopController::class, 'listings_cars'])->name('api.shop.listings');

        Route::prefix('stats')->group(function () {
            Route::get('visits', [ApiController::class, 'shopStats'])->name('shop.stats.visits.graph');
        });
    });
});
