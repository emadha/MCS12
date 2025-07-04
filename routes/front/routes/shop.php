<?php

use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

Route::prefix('shop')->group(function () {
    Route::post('usernameCheck', [ShopController::class, 'usernameCheck'])
        ->name('shop.username.check');

    Route::get(null, [ShopController::class, 'index'])->name('shop.index');

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('create', [ShopController::class, 'form'])->name('shop.create');
        Route::post('create', [ShopController::class, 'store'])->name('shop.store');
    });

    Route::prefix('{shop_frontend_page}')->group(function () {
        Route::get(null, [ShopController::class, 'single'])->name('shop.single');

        Route::middleware('auth')->group(function () {
            Route::get('stats', [ShopController::class, 'stats'])->name('shop.single.stats');
            Route::get('stats/{date}', [ShopController::class, 'statsSingle'])->name('shop.single.stats.single');

            Route::get('edit', [ShopController::class, 'form'])->name('shop.single.edit');
            Route::post('edit', [ShopController::class, 'store'])->name('shop.single.store');
        });
    });
});
