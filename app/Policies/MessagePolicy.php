<?php

namespace App\Policies;

use App\Helpers\Functions;
use App\Models\Message;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Auth;

class MessagePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Message $message): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Message $message): bool
    {
        return Auth::check() && $message->user_id == $user->id;
    }

    public function unsend(User $user, Message $message): bool
    {
        if (!config('site.messages.unsend.enabled'))
            return false;

        if (config('site.messages.unsend.enabled')
            && (Carbon::now()->diffInSeconds($message->created_at) > config('site.messages.unsend.max_allowed_time'))
        ) {
            Functions::addToSession(-1, 'Max allowed time exceeded');

            return false;
        }

        return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Message $message): bool
    {
        return Auth::check() && $message->user_id == $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Message $message): bool
    {
        return Auth::check() && $message->user_id == $user->id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Message $message): bool
    {
        return Auth::check() && $message->user_id == $user->id;
    }
}
