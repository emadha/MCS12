<?php

namespace App\Traits;

use App\Enum\ReactionEnum;
use App\Http\Controllers\ResponseStatusEnum;
use App\Models\Base;
use App\Models\Favorite;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Exceptions\UnauthorizedException;

/**
 *
 */
trait HasReactions
{

    /**
     * @return MorphMany
     */
    public function reactions(): MorphMany
    {
        return $this->morphMany(Favorite::class, 'item');
    }

    public function myReactions(): MorphMany
    {
        return $this->reactions()->where(['user_id' => Auth::id()]);
    }

    /**
     * @return bool
     */
    public function getIsFavoriteAttribute()
    {
        return $this->reactions->where('user_id', Auth::id())->count();
    }

    /**
     * @return array|void
     */
    public function toggleReaction(ReactionEnum $reactionEnum)
    {
        if (!Auth::check()) {
            throw UnauthorizedException::notLoggedIn();
        }

    }

}
