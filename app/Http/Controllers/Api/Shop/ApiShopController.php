<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\Controller;
use App\Http\Resources\Shop\ShopBlockResource;
use App\Models\Shop;
use Illuminate\Http\Request;

class ApiShopController extends Controller
{
    public function shops(Request $request)
    {

        $query = Shop::query();

        if ($request->has('title')) {
            $query->where('title', 'LIKE', '%' . $request->title . '%');
        }

        if ($request->has('predefined_location')) {
            $query->where('predefined_location', $request->predefined_location);
        }

        return ShopBlockResource::collection($query->paginate(5));
    }
}
