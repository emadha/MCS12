<?php

use App\Http\Controllers\Admin\AdminListedController;
use Illuminate\Support\Facades\Route;

Route::prefix('listed')->group(function () {
    Route::get(null, [AdminListedController::class, 'index'])->name('admin.listed.index');
    Route::get('new', [AdminListedController::class, 'form'])->name('admin.listed.new');
    Route::get('{listed}', [AdminListedController::class, 'form'])->name('admin.listed.form');
});
