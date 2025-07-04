<?php

namespace App\Listeners\Shop;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class ShopCreatedListener
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
    public function handle(object $event): void
    {
        if (config('site.notifications.slack.shop.created')) {
            Log::channel('shops')->info('New Shop Created #'.$event->shop->id);
        }
    }
}
