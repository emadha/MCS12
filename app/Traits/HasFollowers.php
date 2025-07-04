<?php

namespace App\Traits;

use App\Models\Follower;

trait HasFollowers
{
    public function followers()
    {
        return $this->hasMany(Follower::class, 'follower_id');
    }

}