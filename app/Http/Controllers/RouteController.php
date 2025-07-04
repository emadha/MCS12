<?php

namespace App\Http\Controllers;

use App\Models\Route;
use Illuminate\Http\Request;

class RouteController extends Controller
{
    public function item(string $url)
    {
        dd($url);

        $Route = Route::where(['url' => $url])->first();

        dd($url, $Route->id);
    }
}
