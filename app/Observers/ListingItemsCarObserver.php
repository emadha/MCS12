<?php

namespace App\Observers;

use App\Models\ListingItemsCar;

class ListingItemsCarObserver
{

    public function retrieved() {}

    /**
     * Handle the ListingItemsCar "created" event.
     */
    public function created(ListingItemsCar $listingItemsCar): void {}

    /**
     * Handle the ListingItemsCar "updated" event.
     */
    public function updated(ListingItemsCar $listingItemsCar): void
    {
        //
    }

    /**
     * Handle the ListingItemsCar "deleted" event.
     */
    public function deleted(ListingItemsCar $listingItemsCar): void
    {
        //
    }

    /**
     * Handle the ListingItemsCar "restored" event.
     */
    public function restored(ListingItemsCar $listingItemsCar): void
    {
        //
    }

    /**
     * Handle the ListingItemsCar "force deleted" event.
     */
    public function forceDeleted(ListingItemsCar $listingItemsCar): void
    {
        //
    }

}
