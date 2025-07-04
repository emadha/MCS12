<?php

use App\Http\Controllers\MessageBoardController;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Route;

Route::prefix('messages')->middleware(['auth'])->group(function () {
    Route::get(null, [MessageBoardController::class, 'index'])
        ->name('messages.index');

    Route::get('new', [MessageBoardController::class, 'newMessage'])
        ->name('messages.new');

    Route::post('new', [MessageBoardController::class, 'newMessageStore'])
        ->name('messages.new.post');

    Route::prefix('{message_board_uuid}')->group(function () {
        Route::get(null, [MessageBoardController::class, 'single'])->name('messages.board.single');
    });

    Route::post('{message_board_uuid}', [MessageController::class, 'sendMessage'])
        ->name('messages.send.post');
});