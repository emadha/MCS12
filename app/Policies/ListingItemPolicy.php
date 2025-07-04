<?php

namespace App\Policies;

use App\Models\ListingItem;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Exceptions\PermissionDoesNotExist;

/**
 *
 */
class ListingItemPolicy
{

    /**
     * @param  \App\Models\User  $user
     *
     * @return bool
     */
    public function approve(User $user): bool
    {
        try {
            return Auth::check() && $user->hasPermissionTo('approve_listing_items');
        } catch (PermissionDoesNotExist) {
            return false;
        }
    }

    /**
     * @param  \App\Models\User  $user
     *
     * @return bool
     */
    public function disapprove(User $user): bool
    {
        try {
            return Auth::check() && $user->hasPermissionTo('disapprove_listing_items');
        } catch (PermissionDoesNotExist) {
            return false;
        }
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ListingItem $listingItem): bool
    {
        return true;
    }

    /**
     * @param  \App\Models\User  $user
     * @param  \App\Models\ListingItem  $listingItem
     *
     * @return bool
     */
    public function edit(User $user, ListingItem $listingItem): bool
    {
        return $listingItem->user_id == $user->id;
    }

    /**
     * @param  \App\Models\User  $user
     * @param  \App\Models\ListingItem  $listingItem
     *
     * @return bool
     */
    public function changeStatus(User $user, ListingItem $listingItem): bool
    {
        return $listingItem->user_id == $user->id;
    }

    /**
     * @param  \App\Models\User  $user
     * @param  \App\Models\ListingItem  $listingItem
     *
     * @return bool
     */
    public function markAsNotSold(User $user, ListingItem $listingItem): bool
    {
        return $listingItem->user_id == $user->id;
    }

    /**
     * @param  \App\Models\User  $user
     * @param  \App\Models\ListingItem  $listingItem
     *
     * @return bool
     */
    public function markAsSold(User $user, ListingItem $listingItem): bool
    {
        return $listingItem->user_id == $user->id;
    }

    public function linkToShop(User $user, ListingItem $listingItem, Shop $shop): bool
    {
        if (($listingItem->user_id !== $user->id)) {
            return false;
        }
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return !config('credits.enabled') && (int) $user->balance?->sum('amount') >= config('credits.prices.post_car');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ListingItem $listingItem): bool
    {
        return $listingItem->user_id == $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ListingItem $listingItem): bool
    {
        return $listingItem->user_id == $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ListingItem $listingItem): bool
    {
        return Auth::check() && $listingItem->user_id == $user->id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ListingItem $listingItem): bool
    {
        return Auth::check() && $listingItem->user_id == $user->id;
    }

    /**
     * @param  \App\Models\User  $user
     * @param  \App\Models\ListingItem  $listingItem
     *
     * @return bool
     */
    public function viewStats(User $user, ListingItem $listingItem): bool
    {
        return Auth::check() && $listingItem->user_id == $user->id;
    }

}
