<?php

namespace App\Observers;

use App\Models\UserPhoto;
use Illuminate\Support\Facades\Storage;

class UserPhotoObserver
{

    /**
     * Handle the UserPhoto "created" event.
     */
    public function created(UserPhoto $userPhoto): void
    {
        //
    }

    /**
     * Handle the UserPhoto "deleted" event.
     */
    public function deleted(UserPhoto $userPhoto): void
    {
        Storage::disk('users')->delete($userPhoto->filename);
    }

}
