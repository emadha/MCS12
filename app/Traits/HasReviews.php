<?php

namespace App\Traits;

use App\Models\Review;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasReviews
{
    /**
     * Get all reviews for this model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    /**
     * Get the average rating for this model.
     *
     * @return float|null
     */
    public function getAverageRatingAttribute(): ?float
    {
        return $this->reviews()->where('is_public', true)->avg('rating');
    }

    /**
     * Get the total number of reviews for this model.
     *
     * @return int
     */
    public function getReviewsCountAttribute(): int
    {
        return $this->reviews()->where('is_public', true)->count();
    }

    /**
     * Get verified reviews for this model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function verifiedReviews(): MorphMany
    {
        return $this->reviews()->where('is_verified', true);
    }

    /**
     * Get public reviews for this model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function publicReviews(): MorphMany
    {
        return $this->reviews()->where('is_public', true);
    }

    /**
     * Add a review to this model.
     *
     * @param array $data Review data
     * @return \App\Models\Review
     */
    public function addReview(array $data): Review
    {
        return $this->reviews()->create($data);
    }
}
