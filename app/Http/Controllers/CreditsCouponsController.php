<?php

namespace App\Http\Controllers;

use App\Models\CreditsCoupons;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class CreditsCouponsController extends Controller
{
    public static function redeem(string $code)
    {
        $creditCoupon = CreditsCoupons::where([
            'code' => strtoupper($code),
        ])->firstOrFail();

        if (!$creditCoupon->redeemed_by && BalanceController::giveCreditsToUser(Auth::user(),
                $creditCoupon->amount,
                'Code Redeemed #'.$code,
                null, $creditCoupon)
        ) {
            $creditCoupon->update([
                'redeemed_by' => Auth::user()->id,
            ]);

            return response([
                'status'  => 1,
                'message' => 'Code Redeemed, '.$creditCoupon->amount.' has been credited to the user',
            ]);
        } else {
            return response([
                'status'  => -1,
                'message' => 'Could not redeem code',
                'errors'  => [
                    'Could not redeem code.',
                ],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }
}
