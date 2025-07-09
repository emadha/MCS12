<?php

use App\Http\Controllers\CarsDatabaseController;
use Illuminate\Support\Facades\Route;

Route::prefix('cars')->group(function () {
    Route::post(null, [CarsDatabaseController::class, 'getAllMakes'])->name('api.cars.makes');
    Route::prefix('{makes}')->group(function () {
        Route::post(null, [CarsDatabaseController::class, 'byMake'])->name('api.cars.makes.models');
        Route::prefix('{models}')->group(function () {
            Route::post(null, [CarsDatabaseController::class, 'byMakeAndModel'])->name('api.cars.makes.models.series');
            Route::prefix('{series}')->group(function () {
                Route::post(null, [CarsDatabaseController::class, 'byMakeAndModelAndSeries'])->name('api.cars.makes.models.series.trims');
            });
        });
    });
});
