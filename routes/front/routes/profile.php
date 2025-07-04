<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('profile')->middleware(['auth'])->group(function () {
    Route::get(null, [ProfileController::class, 'single'])->name('profile.single');
    Route::get('edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('deactivate', [ProfileController::class, 'deactivate'])->name('profile.deactivate');


    Route::middleware(['throttle:profile'])->group(function () {
        Route::post('update', [ProfileController::class, 'update'])->name('profile.updates');
        Route::patch('edit', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('edit', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::patch('disconnect/google', [ProfileController::class, 'disconnectGoogle'])->name('profile.disconnect.google');
        Route::patch('connect/google', [ProfileController::class, 'connectGoogle'])->name('profile.connect.google');
    });
});