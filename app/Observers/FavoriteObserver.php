<?php

namespace App\Observers;

use App\Models\Favorite;
use Illuminate\Support\Facades\Auth;

class FavoriteObserver
{

    public function creating( Favorite $favorite ): void
    {
        $favorite->user_id = Auth::id();
    }

    /**
     * Handle the Favorite "created" event.
     */
    public function created( Favorite $favorite ): void
    {
        //
    }

    /**
     * Handle the Favorite "updated" event.
     */
    public function updated( Favorite $favorite ): void
    {
        //
    }

    /**
     * Handle the Favorite "deleted" event.
     */
    public function deleted( Favorite $favorite ): void
    {
        //
    }

    /**
     * Handle the Favorite "restored" event.
     */
    public function restored( Favorite $favorite ): void
    {
        //
    }

    /**
     * Handle the Favorite "force deleted" event.
     */
    public function forceDeleted( Favorite $favorite ): void
    {
        //
    }
}
