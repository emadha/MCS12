<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Badge extends Model
{
    protected $fillable = [
        'name',
        'description',
        'icon',
        'type',
        'level',
        'requirements',
        'status',
        'points',
        'metadata',
    ];

    protected $casts = [
        'requirements' => 'array',
        'metadata' => 'array',
        'status' => 'boolean',
    ];

    /**
     * Get all models that have this badge.
     */
    public function models(string $model): MorphToMany
    {
        return $this->morphedByMany($model, 'badgeable');
    }
}
