<?php

namespace App\Observers;

use App\Events\Listing\ItemCreatedEvent;
use App\Events\Listing\ListingDeletedEvent;
use App\Exceptions\InsufficientFunds;
use App\Http\Controllers\BalanceController;
use App\Models\ListingItem;
use Illuminate\Support\Facades\Event;

/**
 *
 */
class ListingItemObserver
{

    /**
     * @param  \App\Models\ListingItem  $item
     *
     * @return void
     */
    public function retrieved(ListingItem $item)
    {

    }

    /**
     * @param  ListingItem  $listingItem
     *
     * @return void
     * @throws \App\Exceptions\InsufficientFunds
     */
    public function creating(ListingItem $listingItem): void
    {
        // Check if user has Balance
        if (config('credits.enabled') && ($listingItem->user->balance->sum('amount') < config('credits.prices.post_car'))) {
            throw new InsufficientFunds('Insufficient funds, you need at least '.config('credits.prices.post_car').' credits.');
        }
    }

    /**
     * Handle the ListingItem "created" event.
     */
    public function created(ListingItem $listingItem): void
    {
        $listingItem->item?->createRoutes();

        if (config('credits.enabled')) {
            $balanceToDeduct = config('credits.prices.post_car');

            BalanceController::deductedBalanceFrom(
                user: $listingItem->user,
                amount: $balanceToDeduct,
                note: "New Listing Item Created",
                item: $listingItem

            );
        }

        Event::dispatch(new ItemCreatedEvent($listingItem));
    }

    /**
     * Handle the ListingItem "updated" event.
     */
    public function updated(ListingItem $listingItem): void
    {
        //
    }

    /**
     * Handle the ListingItem "deleted" event.
     */
    public function deleted(ListingItem $listingItem): void
    {
        Event::dispatch(new ListingDeletedEvent($listingItem));
    }

    /**
     * @param  \App\Models\ListingItem  $listingItem
     *
     * @return void
     */
    public function forceDeleted(ListingItem $listingItem): void
    {
        $listingItem->photos()->forceDelete();
        $listingItem->item()->forceDelete();
        $listingItem->contacts()->forceDelete();
        $listingItem->favorites()->forceDelete();
        $listingItem->comments()->forceDelete();
        $listingItem->interaction()->forceDelete();
        $listingItem->promotions()->forceDelete();
    }

    /**
     * Handle the ListingItem "restored" event.
     */
    public function restored(ListingItem $listingItem): void
    {
        //
    }
}
