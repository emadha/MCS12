<?php

namespace App\Traits;

use App\Models\Activity;

/**
 *
 */
trait HasActivity
{

    /**
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function activities()
    {
        return $this->morphMany(Activity::class, 'target');
    }

}
