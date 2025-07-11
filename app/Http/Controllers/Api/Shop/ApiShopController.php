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

        if ($request->has('rating_min') && $request->has('rating_max')) {
            $min = (float)$request->get('rating_min', 0);
            $max = (float)$request->get('rating_max', 5);
            $query->ratingRange($min, $max);
        }

        return ShopBlockResource::collection($query->paginate(12));
    }
}
