<?php

namespace App\Http\Controllers;

use App\Models\PredefinedLocation;
use Illuminate\Http\Request;

class PredefinedLocationController extends Controller
{
    public function getLocationsByRegion(Request $request, string $region)
    {
        return PredefinedLocation::where('region', $region)->get();
    }
}
