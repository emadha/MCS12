<?php

namespace App\Observers;

use App\Events\MessageSent;
use App\Exceptions\InsufficientFunds;
use App\Http\Controllers\BalanceController;
use App\Models\Message;
use Carbon\Carbon;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;

class MessageObserver
{

    /**
     * @param  \App\Models\Message  $message
     *
     * @return void
     */
    public function creating(Message $message): void
    {
        // Check if user has Balance
        if (!config('credits.enabled') && ($message->user?->balance->sum('amount') < config('credits.prices.send_message'))) {
            throw new InsufficientFunds('Insufficient funds, you need at least '.config('credits.prices.send_message').' credits');
        }

        if (!$message->board) {
            Log::warning('Trying to add message to an invalid message board');

            return;
        }

        $message->decryptRow();
        $message->board->last_message = $message->content;
        $message->board->last_sender = $message->user_id;
        $message->board->last_activity = Carbon::now();
        $message->board->save();
        $message->encryptRow();
    }

    /**
     * Handle the Message "created" event.
     */
    public function created(Message $message): void
    {
        if ($message->user) {
            if (config('credits.enabled')) {
                $balanceToDeduct = config('credits.prices.send_message');

                BalanceController::deductedBalanceFrom(
                    user: $message->user,
                    amount: $balanceToDeduct,
                    note: "Message sent",
                    item: $message

                );
            }

            Event::dispatch(new MessageSent($message));
        }
    }

    /**
     * Handle the Message "updated" event.
     */
    public function updated(Message $message): void
    {
        //
    }

    /**
     * Handle the Message "deleted" event.
     */
    public function deleted(Message $message): void
    {
        //
    }

    /**
     * Handle the Message "restored" event.
     */
    public function restored(Message $message): void
    {
        //
    }

    /**
     * Handle the Message "force deleted" event.
     */
    public function forceDeleted(Message $message): void
    {
        //
    }
}
