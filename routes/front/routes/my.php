<?php

use App\Http\Controllers\MyController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->prefix('my')->group(function () {

    Route::get(null, [MyController:: class, 'index'])->name('my.index');

    Route::get('cars', [MyController::class, 'cars'])->name('my.cars');

    Route::prefix('listings')->group(function () {
        Route::get(null, [MyController::class, 'listings'])->name('my.listings');
    });

    Route::prefix('shops')->group(function () {
        Route::get(null, [MyController::class, 'shops'])->name('my.shops');

        Route::prefix('showrooms')->group(function(){
           Route::get('details', [MyController::class,'showrooms'])->name('my.showrooms.details');
        });
    });

});
