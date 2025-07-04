<?php

namespace App\Observers;

use App\Http\Controllers\BalanceController;
use App\Models\Message;
use App\Models\User;

/**
 *
 */
class UserObserver
{

    public function send_message()
    {
        return true;
    }

    /**
     * @param  \App\Models\User  $user
     *
     * @return void
     */
    public function creating(User $user): void
    {
        $user->password_length = strlen($user->password);
    }

    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        if (config('credits.enabled')) {
            BalanceController::giveCreditsToUser($user, config('site.users.welcome_credits'), 'Welcome bonus');
        }
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        //
    }

    public function logged_in(User $user): void
    {
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        session()->flash('message', ['status' => 1, 'message' => 'Account deactivated']);
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        session()->flash('message', ['status' => 1, 'message' => 'Account activated']);
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        //
    }

}
