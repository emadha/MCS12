<?php

namespace App\Observers;

use App\Models\Credit;
use App\Notifications\Credit\UserCredited;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;

class CreditObserver
{

    /**
     * Handle the Credit "created" event.
     */
    public function created(Credit $credit): void
    {
        // todo incomplete, now coins is off so no need to notify user
        //  but the email and notification must be finished first.
        // $credit->user->notifyNow(new UserCredited($credit));
    }

    /**
     * Handle the Credit "updated" event.
     */
    public function updated(Credit $credit): void
    {
        //
    }

    /**
     * Handle the Credit "deleted" event.
     */
    public function deleted(Credit $credit): void
    {
        //
    }

    /**
     * Handle the Credit "restored" event.
     */
    public function restored(Credit $credit): void
    {
        //
    }

    /**
     * Handle the Credit "force deleted" event.
     */
    public function forceDeleted(Credit $credit): void
    {
        //
    }

}
