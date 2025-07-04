<?php

namespace App\Policies;

use App\Helpers\Functions;
use App\Models\MessageBoard;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class MessageBoarsPolicy
{
    public function send_message(User $user, MessageBoard $messageBoard): bool
    {
        $canPay = $this->payForMessage($user, $messageBoard);
        if (!$canPay) {
            Functions::addToSession(1, 'You do not have enough credits to perform this action.');
        }

        return $canPay;
    }

    public function payForMessage(User $user, MessageBoard $messageBoard)
    {
        return $user->balance?->sum('amount') >= config('credits.prices_send_message');
    }

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
    public function view(User $user, MessageBoard $messageBoard): bool
    {
        if ($messageBoard->id) {
            return $messageBoard->participants()->where('user_id', $user->id)->exists();
        }

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
    public function update(User $user, MessageBoard $messageBoard): bool
    {
        return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, MessageBoard $messageBoard): bool
    {
        return Auth::check() && $messageBoard->user_id == $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, MessageBoard $messageBoard): bool
    {
        return Auth::check() && $messageBoard->user_id == $user->id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, MessageBoard $messageBoard): bool
    {
        return Auth::check() && $messageBoard->user_id == $user->id;
    }
}
