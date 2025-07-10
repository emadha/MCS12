<?php

namespace App\Traits;

use App\Models\Badge;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

trait HasBadges
{
    /**
     * Get all of the badges for the model.
     */
    public function badges(): MorphToMany
    {
        return $this->morphToMany(Badge::class, 'badgeable');
    }
}
