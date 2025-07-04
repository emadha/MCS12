<?php

use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::prefix('reports')->middleware(['throttle:reports'])->group(function () {
    Route::post('submit', [ReportController::class, 'submit'])->name('reports.submit');
});
