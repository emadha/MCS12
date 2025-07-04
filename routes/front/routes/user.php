<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('u')->group(function () {
    Route::get('{user}', [UserController::class, 'single'])->name('user.single');
});
