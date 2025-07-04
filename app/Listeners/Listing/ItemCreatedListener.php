<?php

namespace App\Listeners\Listing;

use App\Enum\ActivityEnum;
use App\Events\Listing\ItemCreatedEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ItemCreatedListener
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
    public function handle(ItemCreatedEvent $event): void
    {
        if (config('site.notifications.slack.listing.created')) {
            Log::channel('listings')->info('Item Created #'.$event->listingItem->id);
        }

        if (config('site.activities.log.enabled') && config('site.activities.log.listings')) {
            $event->listingItem->activities()->create([
                'user_id'  => $event->listingItem->user_id,
                'activity' => ActivityEnum::CREATED->name,
            ]);
        }
    }

}
