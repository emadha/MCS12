<?php

namespace App\Traits;

use App\Models\Route;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 *
 */
trait HasRoutes
{

    /**
     * @return Model
     */
    public function createRoutes(): Model
    {
        return $this->routes()->firstOrCreate([
            'url' => $this->links?->relative,
        ]);
    }

    /**
     * @return MorphMany
     */
    public function routes(): MorphMany
    {
        return $this->morphMany(Route::class, 'item');
    }
}