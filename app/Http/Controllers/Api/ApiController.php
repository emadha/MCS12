<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Shop\ShopBlockResource;
use App\Http\Resources\Shop\StatsResource;
use App\Models\Shop;
use App\Models\ShopType;
use Illuminate\Http\Request;

class ApiController extends Controller
{

    public function showrooms(Request $request)
    {
        $promotedShops = Shop::promoted()->get();

        $Shops = Shop::type([ShopType::TYPE_SHOWROOM])
            ->active()
            ->whereNotIn('id', $promotedShops->pluck('id'))
            ->get();

        return [
            'promoted' => ShopBlockResource::collection($promotedShops),
            'showrooms'    => ShopBlockResource::collection($Shops),
        ];
    }

    public function shopStats(Request $request, Shop $shop)
    {
        return new StatsResource($shop);
    }

}
