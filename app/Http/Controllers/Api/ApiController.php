<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Shop\ShopBlockResource;
use App\Http\Resources\Shop\StatsResource;
use App\Models\Shop;
use App\Models\ShopType;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 *
 */
class ApiController extends Controller
{

    /**
     * @param Request $request
     * @return array
     */
    public function showrooms(Request $request)
    {
        $promotedShops = Shop::promoted()->get();

        $Shops = Shop::type([ShopType::TYPE_SHOWROOM])
            ->active()
            ->whereNotIn('id', $promotedShops->pluck('id'))
            ->get();

        return [
            'promoted' => ShopBlockResource::collection($promotedShops),
            'showrooms' => ShopBlockResource::collection($Shops),
        ];
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function changeLocale(Request $request): Response
    {
        app()->setLocale($request->get('locale'));

        return (new Response([
            'lang' => [...__('frontend', [], 'en'), ...__('frontend')],
            'rtl' => app()->isLocale('ar'),
            'locale' => $request->get('locale'),
        ]))->withCookie(cookie('locale', $request->get('locale'), 1000));
    }

    /**
     * @param Request $request
     * @param Shop $shop
     * @return StatsResource
     */
    public function shopStats(Request $request, Shop $shop)
    {
        return new StatsResource($shop);
    }

}
