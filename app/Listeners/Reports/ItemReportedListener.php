<?php

namespace App\Listeners\Reports;

use App\Events\Reports\ItemReported;
use App\Events\Reports\ItemReportedEvent;
use Illuminate\Support\Facades\Log;

class ItemReportedListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(ItemReportedEvent $event): void
    {
        Log::channel('reports')
            ->info("Report submitted: ID#{$event->item->id} | {$event->item->item_type}::{$event->item->item_id} |with the message {$event->item->message}' from the email '{$event->item->email}'");
    }
}
