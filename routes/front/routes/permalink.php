<?php

use App\Http\Controllers\PermalinkController;
use Illuminate\Support\Facades\Route;

Route::prefix('p')->group(function () {
    Route::get('{permalink}', [PermalinkController::class, 'goTo'])
        ->name('permalink.single');
});