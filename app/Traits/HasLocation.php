<?php

namespace App\Traits;

use App\Models\Location;
use App\Models\PredefinedLocation;

trait HasLocation
{
    public function relationPredefinedLocation(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(PredefinedLocation::class,'id','predefined_location');
    }

    public function location()
    {
        return $this->morphOne(Location::class,'item');
    }
}
