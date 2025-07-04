<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('balance')->group(function () {
    Route::get(null, [ProfileController::class, 'balance'])->name('balance.index');

    // Add Balance Routes
    Route::get('add', [ProfileController::class, 'addBalance'])->name('balance.add');
    Route::post('add', [ProfileController::class, 'addBalanceStore'])->name('balance.add.post');

    Route::get('redeem', [ProfileController::class, 'redeem'])->name('balance.redeem');
    Route::post('redeem', [ProfileController::class, 'redeemStore'])->name('balance.redeem.post');
});