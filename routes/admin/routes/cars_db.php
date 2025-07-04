<?php

use App\Http\Controllers\Admin\AdminCarsDBController;
use Illuminate\Support\Facades\Route;

Route::prefix('cars_db')->group(function () {
    Route::get(null, [AdminCarsDBController::class, 'index'])->name('admin.cars_db.index');
    Route::get('new', [AdminCarsDBController::class, 'form'])->name('admin.cars_db.new');
    Route::get('{id_trim}', [AdminCarsDBController::class, 'single'])->name('admin.cars_db.single');

    Route::patch('{id_trim}', [AdminCarsDBController::class, 'formPatch'])->name('admin.cars_db.single.patch');
});
