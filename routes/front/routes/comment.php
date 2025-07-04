<?php

use App\Http\Controllers\CommentController;
use Illuminate\Support\Facades\Route;

Route::prefix('comments')->group(function () {
    Route::get('for', [CommentController::class, 'for'])->name('comments.for');
    Route::post('submit', [CommentController::class, 'submit'])
        ->name('comments.submit');
});
