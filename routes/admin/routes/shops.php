<?php

use App\Http\Controllers\Admin\AdminShopController;
use Illuminate\Support\Facades\Route;

Route::prefix('shops')->group(function () {
    Route::get(null, [AdminShopController::class, 'index'])->name('admin.shops.index');
    Route::get('{shop}', [AdminShopController::class, 'single'])->name('admin.shops.single');
    Route::delete('{shop}', [AdminShopController::class, 'delete'])->name('admin.shops.delete');
    Route::patch('{shop}', [AdminShopController::class, 'store'])->name('admin.shops.store');
});
