<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\Controller;
use App\Http\Resources\Shop\ShopBlockResource;
use App\Models\PredefinedLocation;
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

        $query->whereHas('relationPredefinedLocation', function ($query) {
            $query->where('region', config('site.regions.current'));
        });

        if ($request->get('predefined_location') && $Location = explode(',', ($request->get('predefined_location') ?: ''))
        ) {
            $Location = collect($Location)->filter(function ($location) {
                return $location && PredefinedLocation::where('id', $location)
                        ->whereIn('region', [config('site.regions.current')])
                        ->exists();
            });

            if ($Location->count()) {
                $query->whereHas('relationPredefinedLocation',
                    function ($query) use ($Location) {
                        $query->whereIn('id', $Location);
                    });
            }
        } else {
        }

        if ($request->get('type')) {
            $query->type(explode(',', $request->get('type')));
        }

        if ($request->get('rating_min') !== null || $request->get('rating_max') !== null) {
            $min = (float)$request->get('rating_min', 0);
            $max = (float)$request->get('rating_max', 5);
            $query->ratingRange($min, $max);
        }

        return ShopBlockResource::collection($query->paginate(6));
    }
}
