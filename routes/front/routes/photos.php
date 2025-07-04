<?php

use App\Http\Controllers\PhotoController;
use Illuminate\Support\Facades\Route;

Route::prefix('photos')->group(function () {
    Route::post('upload', [PhotoController::class, 'upload'])->name('photos.upload');
});

//
//use Illuminate\Support\Facades\Route;
//
//Route::prefix('assets/photos')->group(function () {
//    Route::prefix('l')->group(function(){
//        Route::get('{image}', function(){
//            s');
//        });
//    });
//});
