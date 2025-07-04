<?php

namespace App\Observers;

use App\Events\Shop\ShopCreatedEvent;
use App\Http\Controllers\BalanceController;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Support\Facades\Event;

/**
 *
 */
class ShopObserver
{

    /**
     * @param  Shop  $shop
     *
     * @return void
     */
    public function creating(Shop $shop) {}

    /**
     * Handle the Shop "created" event.
     *
     * @param  Shop  $shop
     *
     * @return void
     */
    public function created(Shop $shop): void
    {
        $shop->createDefaultAlbum();

        if (config('credits.enabled')) {
            $balanceToDeduct = config('credits.prices.create_shop');

            BalanceController::deductedBalanceFrom(
                user: $shop->user,
                amount: $balanceToDeduct,
                note: "New Listing Item Created",
                item: $shop
            );
        }

        Event::dispatch(new ShopCreatedEvent($shop));
    }

    public function viewStats(User $user, Shop $shop)
    {
        return $user->id === $shop->user_id;
    }

    /**
     * @param  Shop  $shop
     *
     * @return void
     */
    public function retrieved(Shop $shop): void {}

    /**
     * Handle the Shop "updated" event.
     *
     * @param  Shop  $shop
     *
     * @return void
     */
    public function updated(Shop $shop) {}

    /**
     * Handle the Shop "deleted" event.
     *
     * @param  Shop  $shop
     *
     * @return void
     */
    public function deleted(Shop $shop)
    {
        //
    }

    /**
     * Handle the Shop "restored" event.
     *
     * @param  Shop  $shop
     *
     * @return void
     */
    public function restored(Shop $shop)
    {
        //
    }

    /**
     * Handle the Shop "force deleted" event.
     *
     * @param  Shop  $shop
     *
     * @return void
     */
    public function forceDeleted(Shop $shop)
    {
        //
    }

}
