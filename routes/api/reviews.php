<?php

use App\Http\Controllers\ActionsController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;

Route::prefix('actions')->group(function () {
    Route::prefix('item')->group(function () {
        Route::post(null, [ActionsController::class, 'action'])->name('actions.item');
        Route::post('favorite', [ActionsController::class, 'favorite'])->name('actions.item.favorite');

        # Reviews
        Route::post('/reviews', [ReviewController::class, 'store'])->name('actions.reviews.store');
        Route::put('/reviews/{review}', [ReviewController::class, 'update'])->name('actions.reviews.update');
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('actions.reviews.destroy');
    });


});

