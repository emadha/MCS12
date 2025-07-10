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

        if ($request->get('title')) {
            $query->where('title', 'LIKE', '%' . $request->get('title') . '%');
        }

        if ($request->get('predefined_location')) {
            $query->where('predefined_location', $request->get('predefined_location'));
        }

        if ($request->get('type')) {
            $query->type(explode(',', $request->get('type')));
        }

        return ShopBlockResource::collection($query->paginate(5));
    }
}
