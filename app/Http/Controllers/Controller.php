<?php

namespace App\Http\Controllers;

use App\Http\Resources\ListingItem\Blocks\SimpleBlockResource;
use App\Http\Resources\ListingItem\ListingItemBlocksResource;
use App\Models\ListingItem;
use App\Models\ListingItemsCar;
use App\Models\Shop;
use App\Models\ShopType;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Inertia\Inertia;

class Controller extends BaseController
{

    use AuthorizesRequests, ValidatesRequests;

    public function __construct()
    {
    }

    public function index(Request $request)
    {

        return Inertia::render('Index', [
            'latest_items' => ListingItemBlocksResource::collection(ListingItem::limit(4)
                ->typeCars()
                ->with(['item'])
                ->latest()->get()),

            'total' => [
                'users' => User::count(),
                'listed_cars' => ListingItemsCar::count(),
                'shops' => Shop::type([ShopType::TYPE_SHOWROOM])->count(),
            ],
        ]);
    }

}
