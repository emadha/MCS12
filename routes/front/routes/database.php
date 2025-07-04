<?php

use App\Http\Controllers\CarsDatabaseController;
use Illuminate\Support\Facades\Route;

Route::prefix('database')
    ->domain(env('DOMAINS_ROOT'))
    ->group(function () {
        Route::get(null, [CarsDatabaseController::class, 'index']);

        Route::prefix('cars')->group(function () {
            Route::get(null, [CarsDatabaseController::class, 'findCarBy'])
                ->name('database.cars.index');

            Route::get('{make_slug}', [
                CarsDatabaseController::class, 'findCarBy',
            ])->name('database.cars.make');

            Route::get('{make_slug}/{model_slug}', [
                CarsDatabaseController::class, 'findCarBy',
            ])->name('database.cars.model');

            Route::get('{make_slug}/{model_slug}/{series_slug}', [
                CarsDatabaseController::class, 'findCarBy',
            ])->name('database.cars.series');

            Route::get('{make_slug}/{model_slug}/{series_slug}/{trim}', [
                CarsDatabaseController::class, 'byMakeAndYearAndModelAndSeriesAndTrim',
            ])->name('database.cars.trim');
        });
    });
