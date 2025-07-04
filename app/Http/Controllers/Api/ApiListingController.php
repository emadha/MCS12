<?php

namespace App\Http\Controllers\Api;

use App\Helpers\Functions;
use App\Http\Controllers\Controller;
use App\Http\Resources\Shop\ShopResourceCompact;
use App\Models\Shop;
use App\Models\ShopType;
use App\Rules\ItemHashValidation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApiListingController extends Controller
{

    /**
     * @throws \App\Exceptions\ItemHashException
     */
    public function listingShop(Request $request)
    {
        $this->validate($request, [
            'h' => [
                new ItemHashValidation(),
            ],
        ]);

        $Item = Functions::decryptItemHash($request->get('h'));
        $Shops = Shop::type([ShopType::TYPE_SHOWROOM])
            ->where(['user_id' => Auth::id()])
            ->get();

        return [
            'available_showrooms' => ShopResourceCompact::collection($Shops),
            'selected_showroom'   => $Item->shop_id,
        ];
    }

}
