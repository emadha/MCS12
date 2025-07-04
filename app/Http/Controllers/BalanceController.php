<?php

namespace App\Http\Controllers;

use App\Models\CreditsCoupons;
use App\Models\User;
use App\Notifications\Credit\UserCredited;
use Illuminate\Database\Eloquent\Model;

/**
 *
 */
class BalanceController extends Controller
{

    /**
     * @param  \App\Models\User  $user
     * @param  int  $amount
     * @param  string  $note
     * @param  \Illuminate\Database\Eloquent\Model|null  $item
     * @param  \App\Models\CreditsCoupons|null  $coupon
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    public static function giveCreditsToUser(
        User $user,
        int $amount,
        string $note,
        Model $item = null,
        CreditsCoupons $coupon = null
    ): Model {
        $BalanceUpdated = $user->balance()->create([
            'amount' => $amount,
            'note'   => $note,
        ]);

        if ($item) {
            $BalanceUpdated->update([
                'item_type' => get_class($item),
                'item_id'   => $item->id,
            ]);
        }

        if ($coupon) {
            $BalanceUpdated->update([
                'credits_coupons_id' => $coupon->id,
            ]);
        }

        $user->notifyNow(new UserCredited($BalanceUpdated));

        // Some addition for git, remove late..
        return $BalanceUpdated;
    }


    /**
     * @param  \App\Models\User  $user
     * @param  int  $amount
     * @param  string  $note
     * @param  \Illuminate\Database\Eloquent\Model|null  $item
     * @param  \App\Models\CreditsCoupons|null  $coupon
     *
     * @return \Illuminate\Database\Eloquent\Model|void
     */
    public static function deductedBalanceFrom(
        User $user,
        int $amount,
        string $note,
        Model $item = null,
        CreditsCoupons $coupon = null
    ) {
        if (!config('credits.enabled')) {
            return;
        }

        // todo check if user can pay

        return self::giveCreditsToUser($user, -$amount, $note, $item, $coupon);
    }

}
