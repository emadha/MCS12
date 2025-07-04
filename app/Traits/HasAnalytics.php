<?php

namespace App\Traits;

use App\Models\Analytics;

class HasAnalytics
{
    public function analytics()
    {
        return $this->morphMany(Analytics::class, 'item');
    }
}