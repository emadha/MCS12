<?php

namespace App\Observers;

use App\Helpers\Functions;
use App\Models\MessageBoard;
use Carbon\Carbon;
use Illuminate\Support\Str;

class MessageBoardObserver
{
    public function retrieved(MessageBoard $messageBoard): void
    {
    }

    public function creating(MessageBoard $messageBoard): void
    {
        $messageBoard->uuid = Str::uuid();
        $messageBoard->last_activity = Carbon::now();

        Functions::addToSession(1, 'Message board created');
    }

    public function updating(MessageBoard $messageBoard): void
    {
        $this->last_activity = Carbon::now();
    }

    /**
     * Handle the MessageBoard "created" event.
     */
    public function created(MessageBoard $messageBoard): void
    {
        //
    }

    /**
     * Handle the MessageBoard "updated" event.
     */
    public function updated(MessageBoard $messageBoard): void
    {
        //
    }

    /**
     * Handle the MessageBoard "deleted" event.
     */
    public function deleted(MessageBoard $messageBoard): void
    {
        //
    }

    /**
     * Handle the MessageBoard "restored" event.
     */
    public function restored(MessageBoard $messageBoard): void
    {
        //
    }

    /**
     * Handle the MessageBoard "force deleted" event.
     */
    public function forceDeleted(MessageBoard $messageBoard): void
    {
        //
    }
}
