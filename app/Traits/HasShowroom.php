<?php

namespace App\Traits;

use App\Models\Showroom;

trait HasShowroom
{

    public function showrooms()
    {
        return $this->hasMany(Showroom::class);
    }
}