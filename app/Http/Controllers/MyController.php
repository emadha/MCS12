<?php

namespace App\Http\Controllers;

use App\Helpers\Functions;
use App\Http\Resources\ListingItem\ListingItemBlocksResource;
use App\Http\Resources\Shop\ShopBlockResource;
use App\Models\Shop;
use App\Models\ShopType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MyController extends Controller
{

    public function index(Request $request)
    {
        return Inertia::render('My/Index');
    }

    public function listings(Request $request)
    {
        $data = [
            'title' => Functions::__('My Listings'),
            'cars'  => ListingItemBlocksResource::collection(Auth::user()->cars()->paginate(10)),
        ];

        return Inertia::render('My/Listings', $data);
    }

    public function shops(Request $request)
    {
        $data = [
            'title'       => Functions::__('My Shops'),
            'description' => 'My Shops',
            'shops'       => ShopBlockResource::collection(Auth::user()->shops()->paginate(10)),
        ];

        return Inertia::render('My/Shops', $data);
    }

    public function showrooms(Request $request)
    {
        return Shop::type([ShopType::TYPE_SHOWROOM])
            ->where([
                'id'      => $request->get('showroom_id'),
                'user_id' => Auth::id(),
            ])
            ->first();
    }

}
