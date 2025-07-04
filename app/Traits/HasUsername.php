<?php

namespace App\Traits;

use App\Models\Username;

trait HasUsername
{
    public function username()
    {
        return $this->morphOne(Username::class, 'item');
    }
}