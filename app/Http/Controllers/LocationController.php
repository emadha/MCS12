<?php

namespace App\Http\Controllers;

use App\Models\PredefinedLocation;

class LocationController extends Controller
{

    public function getLocationForCurrentRegion()
    {
        $currentRegion = config('site.regions.current');

        return PredefinedLocation::where('region', $currentRegion)
            ->select(['id', 'region', 'name'])->orderBy('name')->get() ?? [];
    }


}
