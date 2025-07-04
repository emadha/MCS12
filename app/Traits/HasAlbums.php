<?php

namespace App\Traits;

use App\Models\Album;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasAlbums
{
    public function albums(): MorphMany
    {
        return $this->morphMany(Album::class, 'item');
    }

    public function createDefaultAlbum(): void
    {
        // Create Default Album if doesn't exist
        if ( !$this->hasMany(Album::class, 'item_id')->count() ) {
            $storedAlbum = $this->albums()->create([ 'title' => 'Default Album' ]);
        }
    }
}