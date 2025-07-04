<?php

namespace App\Traits;

use App\Models\Stats;

trait HasStats
{

    public function stats()
    {
        return $this->morphMany(Stats::class, 'item');
    }

}
