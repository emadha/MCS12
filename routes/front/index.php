<?php

use App\Http\Controllers\Controller;
use App\Http\Controllers\PagesController;
use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;

require __DIR__.'/routes/auth.php';

Route::domain(config('app.domains.lb'))->group(function () {
    Route::get(null, [Controller::class, 'index'])->name('index.lb');
});

Route::domain(config('app.domains.ae'))->group(function () {
    Route::get(null, [Controller::class, 'index'])->name('index.ae');
});

Route::domain(config('app.domains.sa'))->group(function () {
    Route::get(null, [Controller::class, 'index'])->name('index.sa');
});

Route::domain(config('app.domains.root'))
    ->get(null, [Controller::class, 'index'])->name('index');

Route::get('updates', [PagesController::class, 'updates'])
    ->name('pages.updates');

Route::get('pricing', [PagesController::class, 'pricing'])
    ->name('pages.pricing');

Route::get('privacy', [PagesController::class, 'privacy'])
    ->name('pages.privacy');

Route::get('terms', [PagesController::class, 'terms'])
    ->name('pages.terms');

Route::get('cookies', [PagesController::class, 'cookies'])
    ->name('pages.cookies');

Route::get('support', [PagesController::class, 'support'])
    ->name('pages.support');

Route::get('thankyou', [PagesController::class, 'thankyou'])
    ->name('pages.thankyou');

Route::post(null, [SearchController::class, 'search'])->name('search.post');

require __DIR__.'/routes/permalink.php';
require __DIR__.'/routes/comment.php';
require __DIR__.'/routes/balance.php';
require __DIR__.'/routes/messages.php';
require __DIR__.'/routes/profile.php';
require __DIR__.'/routes/database.php';

require __DIR__.'/routes/listing_cars.php';
require __DIR__.'/routes/listing.php';
require __DIR__.'/routes/photos.php';
require __DIR__.'/routes/shop.php';
// require __DIR__ . '/routes/photos.php';
require __DIR__.'/routes/user.php';
require __DIR__.'/routes/report.php';
require __DIR__.'/routes/my.php';
