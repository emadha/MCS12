<?php

namespace App\Http\Controllers;

use App\Helpers\Functions;
use App\Http\Resources\ListingItem\ListingItemBlocksResource;
use App\Models\ListingItem;
use App\Models\ListingItemsCar;
use App\Models\PredefinedLocation;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use stdClass;

class SearchController extends Controller
{

    public function defaultCriteria(Request $request)
    {
        $Criteria = new stdClass();

        $Criteria->year['min'] = 1964;
        $Criteria->year['max'] = 2023;
        $Criteria->locations
            = (new LocationController())->getLocationForCurrentRegion();

        foreach (ListingItem::CURRENCIES as $_currencyKey => $_currencyValue) {
            $Criteria->currency[] = [
                'label' => strtoupper($_currencyValue),
                'value' => $_currencyKey,
            ];
        }

        $Criteria->exterior_color = collect(ListingItemsCar::EXTERIOR_COLORS)
            ->map(fn($item, $value) => [
                'label' => Functions::__($item),
                'value' => $value,
            ]);

        $Criteria->interior_color = collect(ListingItemsCar::INTERIOR_COLORS)
            ->map(fn($item, $value) => [
                'label' => Functions::__($item),
                'value' => $value,
            ]);

        $Criteria->interior_material = collect(ListingItemsCar::INTERIOR_MATERIAL)
            ->map(fn($item, $value) => [
                'label' => Functions::__($item),
                'value' => $value,
            ]);

        $Criteria->conditions = collect(ListingItem::CONDITIONS)
            ->map(fn($item, $value) => [
                'label' => Functions::__($item),
                'value' => $value,
            ]);

        return $Criteria;
    }

    public function search(Request $request)
    {
        $Criteria = $request->only([
            'makes',
            'models',
            'series',
            'trims',
            'ec',
            'ic',
            'im',
            'co',
            'pf',
            'pt',
            'mf',
            'mt',
            'yf',
            'yt',
            'c',
            'o',
            'r',
            'location',
        ]);

        $Criteria = array_filter($Criteria, function ($val) {
            return $val && trim($val) !== "";
        });

        $Items = ListingItem::where(['item_type' => ListingItemsCar::class])
            ->whereHas('user', function (Builder $userQuery) {
                $userQuery->isActive();
            })
            ->whereHas('item', function (Builder $itemCarQuery) use ($Criteria) {
                // TODO security check here
                $itemCarQuery->whereHas('car',
                    function (Builder $carQuery) use ($Criteria) {
                        if (array_key_exists('makes', $Criteria)
                            && ($Criteria['makes'] && ($Criteria['makes'] !== 'undefined'))
                            && count($Makes = explode(',', $Criteria['makes']))
                        ) {
                            $carQuery->whereIn('make_slug', $Makes);
                        }

                        if (array_key_exists('models', $Criteria)
                            && ($Criteria['models'] && ($Criteria['models'] !== 'undefined'))
                            && count($Models = explode(',',
                                $Criteria['models']))
                        ) {
                            $carQuery->whereIn('model_slug', $Models);
                        }

                        if (array_key_exists('series', $Criteria)
                            && ($Criteria['series'] && ($Criteria['series'] !== 'undefined'))
                            && count($Series = explode(',',
                                $Criteria['series']))
                        ) {
                            $carQuery->whereIn('series_slug', $Series);
                        }

                        if (array_key_exists('trims', $Criteria)
                            && ($Criteria['trims'] && ($Criteria['trims'] !== 'undefined'))
                            && count($Trims = explode(',', $Criteria['trims']))
                        ) {
                            $carQuery->whereIn('trim_slug', $Trims);
                        }
                    });

                if (array_key_exists('ec', $Criteria) && $Criteria['ec']) {
                    $ExteriorColor = array_intersect(
                        explode(',', $Criteria['ec']),
                        array_keys(ListingItemsCar::EXTERIOR_COLORS)
                    );

                    if (count($ExteriorColor)) {
                        $itemCarQuery->whereIn('exterior_color',
                            $ExteriorColor);
                    }
                }

                if (array_key_exists('ic', $Criteria) && $Criteria['ic']) {
                    $InteriorColor = array_intersect(
                        explode(',', $Criteria['ic']),
                        array_keys(ListingItemsCar::INTERIOR_COLORS)
                    );

                    if (count($InteriorColor)) {
                        $itemCarQuery->whereIn('interior_color',
                            $InteriorColor);
                    }
                }

                if (array_key_exists('im', $Criteria) && $Criteria['im']) {
                    $InteriorMaterial = array_intersect(
                        explode(',', $Criteria['im']),
                        array_keys(ListingItemsCar::INTERIOR_MATERIAL)
                    );

                    if (count($InteriorMaterial)) {
                        $itemCarQuery->whereIn('interior_material',
                            $InteriorMaterial);
                    }
                }

                if (array_key_exists('mf',
                        $Criteria) && is_numeric($Criteria['mf'])) {
                    $itemCarQuery->where('odometer', '>=', $Criteria['mf']);
                }

                if (array_key_exists('mt',
                        $Criteria) && is_numeric($Criteria['mt'])) {
                    $itemCarQuery->where('odometer', '<=', $Criteria['mt']);
                }

                if (array_key_exists('yf',
                        $Criteria) && is_numeric($Criteria['yf'])) {
                    $itemCarQuery->where('year', '>=', $Criteria['yf']);
                }

                if (array_key_exists('yt',
                        $Criteria) && is_numeric($Criteria['yt'])) {
                    $itemCarQuery->where('year', '<=', $Criteria['yt']);
                }
            });

        if (array_key_exists('co', $Criteria)) {
            $Conditions = array_intersect(
                explode(',', $Criteria['co']),
                array_keys(ListingItem::CONDITIONS)
            );

            if (count($Conditions)) {
                $Items->whereIn('condition', $Conditions);
            }
        }

        if (array_key_exists('c', $Criteria)
            && array_key_exists(intval($Criteria['c']), ListingItem::CURRENCIES)
        ) {
            $Items->where('currency', $Criteria['c']);

            if (array_key_exists('pf',
                    $Criteria) && is_numeric($Criteria['pf'])) {
                $Items->where('price', '>=', $Criteria['pf']);
            }

            if (array_key_exists('pt',
                    $Criteria) && is_numeric($Criteria['pt'])) {
                $Items->where('price', '<=', $Criteria['pt']);
            }
        }

        $Items->whereHas('relationPredefinedLocation', function ($query) {
            $query->where('region', config('site.regions.current'));
        });

        if (array_key_exists('location', $Criteria)
            && $Location = explode(',', ($Criteria['location'] ?: ''))
        ) {
            $Location = collect($Location)->filter(function ($location) use (
                $Criteria
            ) {
                return $location
                    && PredefinedLocation::where('name', $location)
                        ->whereIn('region', [config('site.regions.current')])
                        ->exists();
            });

            if ($Location->count()) {
                $Items->whereHas('relationPredefinedLocation',
                    function ($query) use ($Criteria, $Location) {
                        $query->whereIn('name', $Location);
                    });
            }
        } else {
        }

        $withData = [
            'user',
            'favorites',
            'photos',
            'user.profilePicture',
            'shop',
            'shop.photos',
            'item',
            'relationPredefinedLocation',
            'item.car',
            'item.listingItem',
            'item.listingItem.item',
            'item.listingItem.item.car',
        ];

        if (config('site.ads.enabled')) {
            $withData[] = 'promotions';
        }

        // Ordering if request has o
        if ($request->has('o')) {
            switch ($request->get('o')) {
                case 'oldest':
                    $Items->orderBy('created_at');
                    break;
                case 'phl':
                    $Items->orderBy('currency')->orderByDesc('price');
                    break;
                case 'plh':
                    $Items->orderBy('currency')->orderBy('price');
                    break;
                case 'cbw':
                    $Items->orderByDesc('condition');
                    break;
                case 'cwb':
                    $Items->orderBy('condition');
                    break;
                default:
                    $Items->orderByDesc('created_at');
            }
        } else {
            // Default ordering
            $Items->orderByDesc('created_at');
        }

        /** @var Builder $Items */
        $Items->with($withData);

        if ($request->user()?->hasRole('Super Admin')) {
            return ListingItemBlocksResource::collection($Items->paginate(12)
                ->appends($Criteria));
        }

        $Items->notSold();

        $Items->approved();

        // fixme find a way to cache this
        return ListingItemBlocksResource::collection($Items->paginate(12)
            ->appends($Criteria));

        // fixme Listing are not cached
        //  can't cache cuz we need pagination, and apparently pagination is not available for collections

        // return Cache::remember('cars.listing.'.collect($Criteria)->flatten()->filter()->join('_'),
        //    10,
        //    function () use ($Items, $request, $Criteria) {
        //    });
    }

}
