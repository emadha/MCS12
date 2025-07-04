<?php

namespace App\Traits;

use App\Http\Controllers\ResponseStatusEnum;
use App\Models\Favorite;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Exceptions\UnauthorizedException;

/**
 *
 */
trait HasFavorites
{

    /**
     * @return MorphMany
     */
    public function favorites(): MorphMany
    {
        return $this->morphMany(Favorite::class, 'item');
    }

    public function myFavorite(): MorphMany
    {
        return $this->favorites()->where(['user_id' => Auth::id()]);
    }

    /**
     * @return bool
     */
    public function getIsFavoriteAttribute()
    {
        return $this->favorites->where('user_id', Auth::id())->count();
    }

    /**
     * @return array|void
     */
    public function toggleFavorite()
    {
        if (!Auth::check()) {
            throw UnauthorizedException::notLoggedIn();
        }

        if ($this->isFavorite) {
            // Remove Favorite
            $this->myFavorite()->first()->delete();
        } else {
            $this->myFavorite()->create();
        }

        return [
            'status' => 1,
            'favoritesCount' => $this->favorites()->count(),
            'inFavorites' => $this->favorites()->where('user_id', Auth::id())->exists(),
        ];
    }

}
