<?php

namespace App\Policies;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Exceptions\PermissionDoesNotExist;

/**
 *
 */
class ShopPolicy
{

    /**
     * @param  \App\Models\User  $user
     * @param  \App\Models\Shop  $shop
     *
     * @return false
     */
    public function seeUnpublishedListingItems(User $user, Shop $shop)
    {
        return false;
    }

    /**
     * @param  \App\Models\User  $user
     *
     * @return bool
     */
    public function approve(User $user): bool
    {
        try {
            return Auth::check() && $user->hasPermissionTo('approve_shop');
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
            return Auth::check() && $user->hasPermissionTo('disapprove_shop');
        } catch (PermissionDoesNotExist) {
            return false;
        }
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Shop $shop): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function pay(User $user): bool
    {
        return !config('credits.enabled') && $user->balance->sum('amount') >= config('credits.prices.create_shop');
    }

    /**
     * @param  \App\Models\User  $user
     * @param  \App\Models\Shop  $shop
     *
     * @return bool
     */
    public function edit(User $user, Shop $shop): bool
    {
        return $shop->user_id === Auth::user()->id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Shop $shop): bool
    {
        return Auth::check() && $shop->user_id == $user->id;
    }

    public function list(User $user, Shop $shop): bool
    {
        return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Shop $shop): bool
    {
        return Auth::check() && $shop->user_id == $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Shop $shop): bool
    {
        return Auth::check() && $shop->user_id == $user->id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Shop $shop): bool
    {
        return Auth::check() && $shop->user_id == $user->id;
    }

}
