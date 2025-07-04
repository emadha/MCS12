<?php

use App\Http\Controllers\Admin\AdminController;
use Illuminate\Support\Facades\Route;

Route::get(null, [AdminController::class, 'index'])->name('admin.index');

Route::prefix('users')->group(function () {
    Route::get(null, [AdminController::class, 'users'])->name('admin.users.index');
});

Route::prefix('shops')->group(function () {
    Route::get(null, [AdminController::class, 'shops'])->name('admin.shops.index');
});

Route::prefix('listed')->group(function () {
    Route::get(null, [AdminController::class, 'listed'])->name('admin.listed.index');
});

Route::prefix('roles_permissions')->group(function () {
    Route::get(null, [AdminController::class, 'roles_permissions'])->name('admin.roles_permissions.index');
});

Route::prefix('settings')->group(function () {
    Route::get(null, [AdminController::class, 'settings'])->name('admin.settings.index');
    Route::post(null, [AdminController::class, 'settingsStore'])->name('admin.settings.post');

    Route::get('sitemap', [AdminController::class, 'sitemap'])->name('admin.sitemap');
});

require __DIR__.'/routes/listed.php';
require __DIR__.'/routes/auth.php';
require __DIR__.'/routes/cars_db.php';





