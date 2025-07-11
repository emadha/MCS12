<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;


Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');

