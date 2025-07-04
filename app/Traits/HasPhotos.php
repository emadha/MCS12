<?php

namespace App\Traits;

use App\Models\Album;
use App\Models\Photo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 *
 */
trait HasPhotos
{

    /**
     * @return BelongsTo
     */
    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }

    public function getPhotosCountAttribute(): int
    {
        return $this->photos()->count();
    }

    /**
     * @return MorphMany
     */
    public function photos(): MorphMany
    {
        return $this->morphMany(Photo::class, 'item')
            ->orderByDesc('is_primary');
    }

    /**
     * @return object|null
     */
    public function getCoverPhotoAttribute(): object|null
    {
        return $this->photos()->where(['is_cover' => 1])->first();
    }

    /**
     * @return object|null
     */
    public function getPrimaryPhotoAttribute(): object|null
    {
        return $this->photos()->where(['is_primary' => 1])->first() ?? $this->photos()->first();
    }

    public function PrimaryPhoto(): MorphMany
    {
        return $this->photos()
            ->where('is_primary', true);
    }

    /**
     * @param  Photo  $photo
     *
     * @return Photo
     */
    public function setPhotoToPrimary(Photo $photo): Photo
    {
        // Set all to false
        Photo::where([
            'item_id'    => $this->id,
            'item_type'  => get_class($this),
            'is_primary' => true,
        ])->update(['is_primary' => false]);

        $photo->is_primary = true;
        $photo->item_id = $this->id;
        $photo->item_type = get_class($this);

        $photo->save();
        return $photo;
    }

    /**
     * @param  Photo  $photo
     *
     * @return Photo
     */
    public function setPhotoToCover(Photo $photo): Photo
    {
        $SelectedPhoto = $this->photos()->find($photo->id);
        $SelectedPhoto->is_cover = true;
        $SelectedPhoto->save();

        return $SelectedPhoto;
    }

    public function generatePhotoThumbs(Photo $photo) {}

}
