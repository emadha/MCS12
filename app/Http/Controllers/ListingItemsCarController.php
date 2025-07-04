<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\ListingItem;
use App\Models\ListingItemsCar;
use App\Rules\ShowroomAuthorized;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ListingItemsCarController extends ListingItemController
{

    /**
     * @return string[]
     */
    public static function rules(Request $request): array
    {
        $request->request->add(['odometer' => abs($request->get('odometer'))]);

        return [
            'showroom'          => ['nullable', new ShowroomAuthorized()],
            'make'              => 'required',
            'model'             => 'required',
            'series'            => 'required',
            'trim'              => 'required',
            'exterior_color'    => ['required', Rule::in(array_keys(ListingItemsCar::EXTERIOR_COLORS))],
            'interior_color'    => ['required', Rule::in(array_keys(ListingItemsCar::INTERIOR_COLORS))],
            'interior_material' => ['required', Rule::in(array_keys(ListingItemsCar::INTERIOR_MATERIAL))],
            'odometer'          => 'required|integer|min:0',
            'vin'               => 'nullable',
        ];
    }

    public static function storeSub(Request $request, ListingItem $listingItem): mixed
    {
        // Guess the car ID from cars table
        $carIDCriteria = [
            'make_slug'   => $request->get('make'),
            'model_slug'  => $request->get('model'),
            'series_slug' => $request->get('series'),
            'trim_slug'   => $request->get('trim'),
        ];

        $request->request->add([
                'car_id' => Car::select('id_trim')
                    ->where($carIDCriteria)
                    ->first()?->id_trim,
            ]
        );

        if ($listingItem->item) {
            $listingItem->item->odometer = $request->get('odometer');
            $listingItem->item->exterior_color = $request->get('exterior_color');
            $listingItem->item->interior_material = $request->get('interior_material');
            $listingItem->item->interior_color = $request->get('interior_color');
            $listingItem->item->save();
        }

        // todo I don't like this...
        return $listingItem?->item ?? ListingItemsCar::create($request->all());
    }

}
