<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Admin routes with role middleware
Route::middleware(['auth', 'role:any'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        return redirect()->route('admin.dashboard');
    });

    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    // User management routes - only accessible by super-admin and admin
    Route::middleware(['role:super-admin,admin'])->group(function () {
        Route::resource('users', UserController::class);
    });
});
