<?php

namespace App\Traits;

use App\Models\Promotion;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

/**
 *
 */
trait HasPromotion
{

    /**
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     *
     * @return void
     */
    public function scopePromoted(Builder $query): void
    {
        $query->whereHas('promotions');
    }

    /**
     * @param  \Carbon\Carbon|null  $duration
     * @param  bool  $removePreviousPromotions
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function promote(
        Carbon $duration = null,
        bool $removePreviousPromotions = true
    ): Model {
        // Delete previous promotions if any
        if ($removePreviousPromotions) {
            $this->disPromote();
        }

        return $this->promotions()->create([
            'user_id'    => $this->user_id,
            'item_type'  => self::class,
            'item_id'    => $this->id,
            'expires_at' => $duration ?? Carbon::now()->addDays(30),
            'is_active'  => 1,
        ]);
    }

    /**
     * @return int
     */
    public function disPromote(): int
    {
        return $this->promotions()?->delete();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\MorphOne
     */
    public function promotions(): MorphOne
    {
        return $this->morphOne(Promotion::class, 'item');
    }

}
