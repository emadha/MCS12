<?php

namespace App\Http\Controllers;

use App\Enum\ContactMethodEnum;
use App\Enum\CurrenciesEnum;
use App\Helpers\Functions;
use App\Http\Middleware\Access\CanAccessMiddleware;
use App\Http\Resources\Listing\ListingFormResource;
use App\Http\Resources\ListingItem\ListingItemBlocksResource;
use App\Http\Resources\ListingItem\ListingItemPageSingleResource;
use App\Models\ListingItem;
use App\Models\ListingItemsCar;
use App\Models\Photo;
use App\Models\PredefinedLocation;
use App\Models\Shop;
use App\Models\ShopType;
use App\Rules\ContactRule;
use Carbon\Carbon;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\QueriesRelationships;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Mockery\Exception;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

/**
 *
 */
class ListingItemController extends Controller
{

    /**
     * @param string $query
     * @param string $type
     * @return QueriesRelationships|Builder
     */
    public static function search(string $query, string $type = ListingItemsCar::class)
    {
        return ListingItem::whereHasMorph(
            'item', $type,
            fn(Builder $builder) => $builder
                ->whereHas('car', fn(Builder $carBuilder) => $carBuilder
                    ->where("make", $query)
                    ->orWhere("model", $query)
                    ->orWhere("trim", $query)
                    ->orWhere("series", $query)
                    ->orWhereRaw("CONCAT (`make`,' ', `model`) LIKE ?", ['%' . $query . '%'])
                    ->orWhereRaw("CONCAT (`make`,' ', `trim`) LIKE ?", ['%' . $query . '%'])
                    ->orWhereRaw("CONCAT (`make`,' ', `series`) LIKE ?", ['%' . $query . '%'])
                    ->orWhereRaw("CONCAT (`series`,' ', `make`) LIKE ?", ['%' . $query . '%'])
                    ->orWhereRaw("CONCAT (`series`,' ', `model`) LIKE ?", ['%' . $query . '%'])
                    ->orWhereRaw("CONCAT (`series`,' ', `trim`) LIKE ?", ['%' . $query . '%'])
                    ->orWhereRaw("CONCAT (`series`,' ', `series`) LIKE ?", ['%' . $query . '%'])
                    ->orWhereRaw("CONCAT (`series`,' ', `series`) LIKE ?", ['%' . $query . '%'])
                    ->orWhereRaw("CONCAT (`model`,' ', `trim`) LIKE ?", ['%' . $query . '%'])
                    ->orWhereRaw("CONCAT (`model`,' ', `trim`,' ',`series`) LIKE ?", ['%' . $query . '%'])
                    ->orWhereRaw("CONCAT (`model`,' ', `series`) LIKE ?", ['%' . $query . '%'])
                    ->orWhereRaw("CONCAT (`make`,' ', `model`,' ',`trim`) LIKE ?", ['%' . $query . '%'])
                    ->orWhereRaw("CONCAT (`make`,' ', `model`,' ',`trim`,' ',`series`) LIKE ?", ['%' . $query . '%'])
                )
        );
    }

    /**
     *
     */
    public function __construct()
    {
        parent::__construct();

        $this->middleware(['auth'])->only([
            'toggleFavorite',
            'form',
            'edit',
            'store',
        ]);

        $this->middleware([
            CanAccessMiddleware::class
        ])->only(['form', 'edit', 'store']);
    }

    /**
     * @param Request $request
     *
     * @return Response
     */
    public function index(Request $request): Response
    {
        return Inertia::render('Listing/Index', [
            'title' => 'Listing Index',
            'listings' => ListingItemBlocksResource::collection(ListingItem::limit(10)->get()),
        ]);
    }

    /**
     * @param Request $request
     * @param $condition
     * @param \App\Models\ListingItem $listing_item
     *
     * @return \Illuminate\Http\RedirectResponse|\Inertia\Response
     */
    public function single(Request $request, $condition,ListingItem $listing_frontend): RedirectResponse|Response
    {

        if (($request->url() !== $listing_frontend->item->links->item) && $listing_frontend->item?->links?->item) {
            return Redirect::to($listing_frontend->item->links->item, ResponseAlias::HTTP_MOVED_PERMANENTLY);
        }

        // +1 View on visit
        $listing_frontend->increment('views');

        $listingResource = new ListingItemPageSingleResource($listing_frontend);
        $title = $listing_frontend->display->title;

        $data = [
            'title' => $title,
            'description' => $listing_frontend->description,
        ];

        View::share($data);

        return Inertia::render('Listing/Cars/Single', [
            ...$data,
            'item' => $listingResource,
            'can' => [
                'edit' => $request->user()?->can('edit', $listing_frontend),
            ],
        ]);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ListingItem $listingItem
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response|\Inertia\Response
     */
    public function stats(Request $request, ListingItem $listingItem)
    {
        if (!$request->user()?->can('markAsNotSold', $listingItem)) {
            return response([
                'status' => -1,
                'message' => __('Unauthorized'),
            ], ResponseAlias::HTTP_UNAUTHORIZED);
        }

        $title = 'Stats - ' . $listingItem->display->title;
        View::share(['title' => $title]);

        return Inertia::render('Listing/Stats', [
            'title' => $title,
            'listingItem' => $listingItem,
        ]);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ListingItem $listingItem
     *
     * @return \Illuminate\Http\RedirectResponse|void
     */
    public function singleByIDOnly(Request $request, ListingItem $listingItem)
    {
        if ($listingItem->item?->links?->item) {
            return Redirect::to($listingItem->item->links->item, ResponseAlias::HTTP_MOVED_PERMANENTLY);
        }

        abort(404);
    }

    /**
     * @param Request $request
     * @param ListingItem $listingItem
     *
     * @return Response
     */
    public function edit(Request $request, ListingItem $listingItem): Response
    {
        return Inertia::render('Listing/Cars/Edit', [
            'title' => $listingItem->id ? $listingItem->display->title : 'Submit your car',
            'item' => new ListingFormResource($listingItem),
            'contactMethods' => ContactMethodEnum::names(),
            'conditions' => ListingItem::CONDITIONS,
            'csrf_token' => csrf_token(),
            'currencies' => collect(CurrenciesEnum::cases())->map(function ($currency) {
                return ['label' => $currency->name, 'value' => strtolower($currency->name)];
            })->toArray(),
        ]);
    }

    /**
     * @param Request $request
     * @param ListingItem $listing_frontend
     *
     * @return Response
     */
    public function form(Request $request, ListingItem $listing_frontend): Response
    {
        return Inertia::render('Listing/Cars/Form', [
            'title' => Functions::__('List your Car'),
            'listingItem' => new ListingItemBlocksResource($listing_frontend),
            'contactMethods' => ContactMethodEnum::names(),
            'csrf_token' => csrf_token(),
            'max_filesize' => '100MB',
            'cost' => config('credits.prices.post_car'),
        ]);
    }

    /**
     * @param $description
     * @param $currency
     * @param $price
     * @param $condition
     *
     * @return void
     */
    public static function create(
        $description,
        $currency,
        $price,
        $condition
    )
    {
    }

    public function editStore(Request $request, ListingItem $listingItem)
    {
        $request->validate([
            'description' => 'required|min:0|max:200000',
            'price' => 'required|int|min:1|max:1000000000000000',
            'condition' => ['required', Rule::in(array_keys(ListingItem::CONDITIONS))],
            'contacts' => ['required_if:showroom,null', new ContactRule()],
            'photos' => [
                'required',
                'min:' . config('site.listing.photos.min'),
                'max:' . config('site.listing.photos.max.free'),
            ],
        ]);

        $listingItem->description = $request->get('description');
        $listingItem->price = $request->get('price');
        $listingItem->condition = $request->get('condition');
        $listingItemSaved = $listingItem->save();

        foreach ($request->get('photos') ?: [] as $_photo) {
            try {
                /**
                 * todo needs attention: what if photos fail? item stays without photos?
                 * Update temp photos and attach item to them
                 * after decrypting the $_photo var
                 * which contains the id of the temp photo
                 */
                Photo::where(['id' => decrypt($_photo)])

                    // Only pick items with no item_id or item_type
                    ->whereNull(['item_id', 'item_type'])

                    // Update those fields
                    ->update([
                        'item_id' => $listingItem->id,
                        'item_type' => get_class($listingItem),
                    ]);

                $Photo = Photo::where('id', decrypt($_photo))->first();

                if ($Photo) {
                    // Move the photos from temp to live
                    $tempFile = 'temp_photos/orphans/' . $Photo->filename;
                    $destinationFile = 'public/photos/l/' . $Photo->filename;

                    if (Storage::exists($tempFile)) {
                        Storage::move($tempFile, $destinationFile);
                        // or Storage::copy($tempFile, $destinationFile);
                    } else {
                        throw new Exception('Temp photo does not exist.');
                    }
                }
            } catch (DecryptException|Exception) {
                return back()->withErrors(['Error']);
            }
        }

        dd($request->all());
        return back()->with([
            'message' => [
                'status' => $listingItemSaved ? 1 : 0,
                'message' => $listingItemSaved ? 'Item has been updated' : 'Failed saving this item',
            ],
        ]);
    }

    /**
     * @param Request $request
     * @param ListingItem $listingItem
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\RedirectResponse|\Illuminate\Http\Response|void
     * @throws ValidationException
     * @throws \Exception
     */
    public function store(Request $request, ListingItem $listingItem)
    {
        if (!Auth::check()) {
            return response([
                'status' => -1,
                'message' => __('Unauthorized'),
            ], ResponseAlias::HTTP_UNAUTHORIZED);
        }

        // Check user funds
        if (config('credits.enabled') && !$request->user()->can('create', $listingItem)) {
            Functions::addToSession(-1, 'You do not have enough credits to perform this action.');

            return back()->withErrors(["You don't have enough credits to perform this action."]);
        }

        $request->request->add([
            'user_id' => $listingItem?->user_id ?? Auth::id(),
            'views' => $listingItem->views ?? 0,
        ]);

        $request->request->add(['region' => config('site.regions.current')]);
        $request->request->add(['predefined_location' => $request->get('location')]);
        $request->request->add(['price' => abs($request->get('price'))]);

        if ($request->get('showroom') !== null) {
            $request->request->remove('contacts');
        }

        if ($listingItem->item) {
            $request->request->add([
                'year' => $listingItem->item->year,
                'make' => $listingItem->item->car->make,
                'model' => $listingItem->item->car->model,
                'series' => $listingItem->item->car->series,
                'trim' => $listingItem->item->car->id_trim,
            ]);
        }

        $listingItemRules = [
            'type' => 'required|in:car',
            'user_id' => 'required|exists:users,id',
            'description' => 'required|min:0|max:200000',
            'price' => 'required|int|min:1|max:1000000000000000',
            'currency' => ['required', Rule::in(array_keys(ListingItem::CURRENCIES))],
            'condition' => ['required', Rule::in(array_keys(ListingItem::CONDITIONS))],
            'location' => [
                'exclude_unless:showroom,null',
                'required',
                function ($attribute, $value, $fails) use ($request) {
                        !PredefinedLocation::where([
                            'id' => $request->get('location'),
                            'region' => $request->get('region'),
                        ])->exists() ?? $fails('ok');
                },
            ],
            'photos' => [
                'required',
                'min:' . config('site.listing.photos.min'),
                'max:' . config('site.listing.photos.max.free'),
            ],
            'contacts' => ['required_if:showroom,null', new ContactRule()],
            'photos.*' => [
                'required',
                function ($attr, $value, $fails) use ($listingItem) {
                    try {
                        if (!$listingItem->photos->contains(decrypt($value))) {
                            if (!Photo::where('id', decrypt($value))->exists()) {
                                $fails('Image not found');
                            }
                        }
                    } catch (DecryptException|Exception|QueryException) {
                        $fails('Image failed');
                    }
                },

            ],
        ];

        // Detect type of item and use its controller's store method
        /** @var \App\Http\Controllers\Controller $ControllerByType */
        $ControllerByType = self::detectControllerByItemParam($request->get('type'));

        if (!$ControllerByType) {
            abort(ResponseAlias::HTTP_BAD_REQUEST);
        }

        // Validate the request
        // Merge the Rules from both the base ListingItem and ListingItemController's rules
        $this->validate($request, rules: [...$listingItemRules, ...$ControllerByType::rules($request)], messages: [
            'photos.required' => 'You need to upload at least ' . config('site.listing.photos.min') . ' photos.',
            'photos.min' => sprintf('You need at least %d photos to continue.', config('site.listing.photos.min')),
            'photos.max' => sprintf('Max number of photos is %d.', config('site.listing.photos.max.free')),
        ]);
        // The validation above will redirect if failed
        // so the lines after will not be reached
        // return; ------------------------------------

        // Create the subtype
        $ControllerByTypeStore = $ControllerByType::storeSub($request, $listingItem);

        if ($ControllerByTypeStore) {
            $request->request->add([
                'item_id' => $ControllerByTypeStore->id,
                'item_type' => get_class($ControllerByTypeStore),
            ]);

            // Create the listing item
            $listingItemRequestData = [...(new ListingItem())->getFillable()];

            if ($request->has('showroom')
                && $Shop = Shop::where([
                    'id' => $request->get('showroom'),
                    'user_id' => $request->user()->id,
                ])->type([ShopType::TYPE_SHOWROOM])->first()
            ) {
                // Shop is found, use location from the item
                $request->request->add(['shop_id' => $Shop->id]);
                $request->request->remove('predefined_location');
            } else {
                // Shop is not defined, we need a location for the item
            }

            $itemUpdatedOrCreated = $listingItem->updateOrCreate(['id' => $listingItem->id],
                $request->only(['item_id', 'item_type', ...$listingItemRequestData])
            );

            if ($itemUpdatedOrCreated) {
                // Update contacts
                $itemUpdatedOrCreated->contacts()->delete();

                collect($request->get('contacts'))
                    ->filter(fn($contact) => $contact['value'])
                    ->each(function ($contact) use ($itemUpdatedOrCreated) {
                        $itemUpdatedOrCreated->contacts()->updateOrCreate([
                            'method' => $contact['method'],
                            'value' => $contact['value'],
                        ], [
                            'method' => $contact['method'],
                            'value' => $contact['value'],
                        ]);
                    });

                foreach ($request->get('photos') ?: [] as $_photo) {
                    if ($listingItem?->photos->contains(decrypt($_photo))) {
                    } else {
                        try {
                            /**
                             * todo needs attention: what if photos fail? item stays without photos?
                             * Update temp photos and attach item to them
                             * after decrypting the $_photo var
                             * which contains the id of the temp photo
                             */
                            Photo::where(['id' => decrypt($_photo)])

                                // Only pick items with no item_id or item_type
                                ->whereNull(['item_id', 'item_type'])

                                // Update those fields
                                ->update([
                                    'item_id' => $itemUpdatedOrCreated->id,
                                    'item_type' => get_class($itemUpdatedOrCreated),
                                ]);

                            $Photo = Photo::where('id', decrypt($_photo))->first();

                            if ($Photo) {
                                // Move the photos from temp to live
                                $tempFile = 'temp_photos/orphans/' . $Photo->filename;
                                $destinationFile = 'public/photos/l/' . $Photo->filename;

                                if (Storage::exists($tempFile)) {
                                    Storage::move($tempFile, $destinationFile);
                                    // or Storage::copy($tempFile, $destinationFile);
                                } else {
                                    throw new Exception('Temp photo does not exist.');
                                }
                            }
                        } catch (DecryptException|Exception) {
                            $itemUpdatedOrCreated->delete($request, $itemUpdatedOrCreated);

                            return back()->withErrors(['Error']);
                        }
                    }
                }

                $itemUpdatedOrCreated->with([
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
                ]);

                $responseBackData = [
                    [
                        'status' => 1,
                        'message' => $itemUpdatedOrCreated->display->title . ' successfully added',
                        'item' => new ListingItemBlocksResource($itemUpdatedOrCreated),
                    ],
                ];

                if (config('credits.enabled')) {
                    $responseBackData[] = ['status' => 1, 'message' => config('credits.prices.post_car') . ' credits were deducted from your balance.'];
                }

                return back()->with([
                    'message' => $responseBackData,
                ]);
            }
        }
    }

    /**
     * @param string $type
     *
     * @return false|string
     */
    public static function detectControllerByItemParam(string $type): false|string
    {
        $Controllers = [
            'car' => ListingItemsCarController::class,
        ];

        return array_key_exists($type, $Controllers)
            ? $Controllers[$type] : false;
    }

    /**
     * @param Request $request
     * @param ListingItem $listingItem
     *
     * @return mixed
     */
    public function toggleFavorite(Request $request, ListingItem $listingItem): mixed
    {
        return $listingItem->toggleFavorite();
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param ListingItem $listingItem
     * @param string $related_type
     * @param int $limit
     *
     * @return AnonymousResourceCollection
     */
    public function getRelatedToItem(Request $request, ListingItem $listingItem, string $related_type, int $limit = 8)
    {
        $related_type = explode(',', $related_type);
        $price_range = 1000;
        $listingItemResult = $listingItem;

        $listingItemResult = $listingItemResult->whereHas('relationPredefinedLocation', function ($query) {
            $query->where('region', config('site.regions.current'));
        });

        foreach ($related_type as $_related_type) {
            if ($_related_type === 'price') {
                $listingItemResult = $listingItemResult
                    ->whereBetween('price',
                        [$listingItem->price - $price_range, $listingItem->price + $price_range])
                    ->where('currency', $listingItem->currency);
            }

            if ($_related_type === 'make') {
                $listingItemResult = $listingItemResult->whereHas('item', function ($itemQuery) use ($listingItem, $listingItemResult, $related_type) {
                    $itemQuery->whereHas('car', function ($carQuery) use ($listingItem, $related_type) {
                        $carQuery->where('make', $listingItem->item->car->make);
                    });
                });
            }

            if ($_related_type === 'model') {
                $listingItemResult = $listingItemResult->whereHas('item', function ($itemQuery) use ($listingItem, $listingItemResult, $related_type) {
                    $itemQuery->whereHas('car', function ($carQuery) use ($listingItem, $related_type) {
                        $carQuery->where('model', $listingItem->item->car->model);
                    });
                });
            }

            if ($_related_type === 'year') {
                $listingItemResult = $listingItemResult->whereHas('item', function ($itemQuery) use ($listingItem, $listingItemResult, $related_type) {
                    $itemQuery->whereHas('car', function ($carQuery) use ($listingItem, $related_type) {
                        $carQuery->where('year_from', $listingItem->item->car->year_from);
                    });
                });
            }

            if ($_related_type === 'exterior_color') {
                $listingItemResult = $listingItem->whereHas('item', function ($itemQuery) use ($listingItem, $listingItemResult, $related_type) {
                    $itemQuery->where('exterior_color', $listingItem->item->exterior_color);
                });
            }

            if ($_related_type === 'interior_color') {
                $listingItemResult = $listingItem->whereHas('item', function ($itemQuery) use ($listingItem, $listingItemResult, $related_type) {
                    $itemQuery->where('interior_color', $listingItem->item->interior_color);
                });
            }
            if ($_related_type === 'interior_material') {
                $listingItemResult = $listingItem->whereHas('item', function ($itemQuery) use ($listingItem, $listingItemResult, $related_type) {
                    $itemQuery->where('interior_material', $listingItem->item->interior_material);
                });
            }

            if ($_related_type === 'body_type') {
                $listingItemResult = $listingItem->whereHas('item', function ($itemQuery) use ($listingItem, $listingItemResult, $related_type) {
                    $itemQuery->whereHas('car', function ($carQuery) use ($listingItem, $related_type) {
                        $carQuery->where('body_type', $listingItem->item->car->body_type);
                    });
                });
            }

            if ($_related_type === 'condition') {
                $listingItemResult = $listingItem->where('condition', $listingItem->condition);
            }

            if ($_related_type === 'location') {
                $listingItemResult = $listingItem->whereHas('item', function ($itemQuery) use ($listingItem, $listingItemResult, $related_type) {
                    $itemQuery->where('interior_material', $listingItem->item->interior_material);
                });
            }
        }

        // Exclude the current item
        $listingItemResult->whereNot('id', $listingItem->id);

        return ListingItemBlocksResource::collection($listingItemResult->limit($limit)->get());
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ListingItem $listingItem
     *
     * @return array|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response
     */
    public function approve(Request $request, ListingItem $listingItem)
    {
        if (!$request->user()->can('approve', $listingItem)) {
            return response([
                'status' => -1,
                'message' => __('Unauthorized'),
            ], ResponseAlias::HTTP_UNAUTHORIZED);
        }

        $listingItem->with(['item']);
        if ($listingItem->update(['is_approved' => 1])) {
            return [
                'status' => 1,
                'message' => __('frontend.Item Approved'),
                'updatedItem' => new ListingItemBlocksResource($listingItem),
            ];
        } else {
            return [
                'status' => 0,
                'message' => __('frontend.Failed'),
            ];
        }
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ListingItem $listingItem
     *
     * @return array|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response
     */
    public function disapprove(Request $request, ListingItem $listingItem)
    {
        if (!$request->user()->can('disapprove', $listingItem)) {
            return response([
                'status' => -1,
                'message' => __('frontend.Not Authorized'),
            ], ResponseAlias::HTTP_UNAUTHORIZED);
        }

        $listingItem->with(['item']);
        if ($listingItem->update(['is_approved' => 0])) {
            return [
                'status' => 1,
                'message' => __('frontend.Item Disapproved'),
                'updatedItem' => new ListingItemBlocksResource($listingItem),
            ];
        } else {
            return [
                'status' => 0,
                'message' => 'Could not disapprove this item!',
            ];
        }
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ListingItem $listingItem
     *
     * @return array|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response
     */
    public function markAsNotSold(Request $request, ListingItem $listingItem)
    {
        if (!$request->user()->can('markAsNotSold', $listingItem)) {
            return response([
                'status' => -1,
                'message' => __('Unauthorized'),
            ], ResponseAlias::HTTP_UNAUTHORIZED);
        }

        if (!$listingItem->sold_at) {
            return response([
                'status' => -1,
                'message' => __('Failed'),
            ], ResponseAlias::HTTP_OK);
        }

        $listingItem->with(['item']);
        if ($listingItem->update(['sold_at' => null])) {
            return [
                'status' => 1,
                'message' => __('frontend.Item marked as not sold'),
                'updatedItem' => new ListingItemBlocksResource($listingItem),
            ];
        } else {
            return [
                'status' => 0,
                'message' => __('frontend.Failed'),
            ];
        }
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ListingItem $listingItem
     *
     * @return array|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response
     */
    public function markAsSold(Request $request, ListingItem $listingItem)
    {
        if (!$request->user()->can('markAsSold', $listingItem)) {
            return response([
                'status' => -1,
                'message' => __('Unauthorized'),
            ], ResponseAlias::HTTP_UNAUTHORIZED);
        }

        if ($listingItem->sold_at) {
            return response([
                'status' => -1,
                'message' => __('Failed'),
            ], ResponseAlias::HTTP_OK);
        }

        $listingItem->with('item');
        if ($listingItem->update(['sold_at' => Carbon::now()])) {
            return [
                'status' => 1,
                'message' => __('frontend.Item marked as sold'),
                'updatedItem' => new ListingItemBlocksResource($listingItem),
            ];
        } else {
            return [
                'status' => 0,
                'message' => __('frontend.Failed'),
            ];
        }
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ListingItem $listingItem
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response
     */
    public function action_delete(
        Request     $request,
        ListingItem $listingItem
    ): \Illuminate\Foundation\Application|\Illuminate\Http\Response|Application|ResponseFactory
    {
        if (!$request->user()->can('delete', $listingItem)) {
            return response([
                'status' => -1,
                'message' => __('Unauthorized'),
            ], ResponseAlias::HTTP_UNAUTHORIZED);
        }

        if ($listingItem->delete()) {
            return response([
                'status' => 1,
                'message' => __('frontend.Item Deleted'),
            ]);
        } else {
            return response([
                'status' => 0,
                'message' => __('frontend.Failed'),
            ]);
        }
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ListingItem $listingItem
     *
     * @return array|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response
     */
    public function action_mark_as_sold(Request $request, ListingItem $listingItem)
    {
        return $this->markAsSold($request, $listingItem);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ListingItem $listingItem
     *
     * @return array|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response
     */
    public function action_mark_as_not_sold(Request $request, ListingItem $listingItem)
    {
        return $this->markAsNotSold($request, $listingItem);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ListingItem $listingItem
     *
     * @return array|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response
     */
    public function action_approve(Request $request, ListingItem $listingItem)
    {
        return $this->approve($request, $listingItem);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ListingItem $listingItem
     *
     * @return \Illuminate\Foundation\Application|\Illuminate\Http\Response|array|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory
     */
    public function action_disapprove(
        Request     $request,
        ListingItem $listingItem
    ): \Illuminate\Foundation\Application|\Illuminate\Http\Response|array|Application|ResponseFactory
    {
        return $this->disapprove($request, $listingItem);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ListingItem $listingItem
     *
     * @return \Illuminate\Foundation\Application|\Illuminate\Http\Response|array|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory
     */
    public function action_shop_link(
        Request     $request,
        ListingItem $listingItem
    ): \Illuminate\Foundation\Application|\Illuminate\Http\Response|array|Application|ResponseFactory
    {
        $shop_id = null;
        if ($request->get('shop_id')) {
            $Shop = Shop::where(['id' => $request->get('shop_id'), 'user_id' => Auth::id()])->first();
            if (!$Shop) {
                return response([
                    'status' => -1,
                    'message' => 'Invalid shop',
                ]);
            }

            $shop_id = $Shop->id;

            if (!$request->user()->can('update')) {
                return response([
                    'status' => -1,
                    'message' => 'Not authorized',
                ], ResponseAlias::HTTP_UNAUTHORIZED);
            }
        }

        $listingItem->shop_id = $shop_id;
        $saved = $listingItem->save();

        return response([
            'status' => 1,
            'updatedItem' => new ListingItemBlocksResource($listingItem),
            'message' => $saved
                ? (
                $listingItem->wasChanged()
                    ? 'Updated item link'
                    : 'Nothing to update'
                )
                : 'Failed to update link',
        ]);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ListingItem $listingItem
     *
     * @return \Illuminate\Support\Collection
     */
    public function contextMenu(Request $request, ListingItem $listingItem): Collection
    {
        $contextMenu = collect([]);

        if ($request->user()?->can('approve', $listingItem) && !$listingItem->is_approved) {
            $contextMenu->add([
                'title' => __('frontend.Approve'),
                'action_id' => 'approve',
                'icon' => '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="pen-to-square" class="svg-inline--fa fa-pen-to-square " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"></path></svg>',
            ]);
            $contextMenu->add(['title' => '-']); // todo later move this to one place, it's repeated
        } elseif ($request->user()?->can('disapprove', $listingItem) && $listingItem->is_approved) {
            $contextMenu->add([
                'title' => __('frontend.Disapprove'),
                'action_id' => 'disapprove',
                'icon' => '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="pen-to-square" class="svg-inline--fa fa-pen-to-square " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"></path></svg>',
            ]);
            $contextMenu->add(['title' => '-']);
        }

        if ($request->user()?->can('changeStatus', $listingItem)) {
            $contextMenu->add([
                'title' => $listingItem->sold_at ? __('frontend.Mark as not Sold') : __('frontend.Mark as Sold'),
                'action_id' => $listingItem->sold_at ? 'mark_as_not_sold' : 'mark_as_sold',
            ]);
        }

        if ($request->user()?->can('linkToShop', $listingItem)) {
            $contextMenu->add([
                'title' => __('frontend.Shop Link'),
                'icon' => $listingItem->shop_id
                    ? '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" class="svg-inline--fa fa-xmark " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path></svg>'
                    : '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>',
                'action_id' => 'shop_link',
            ]);
        }

        if ($request->user()?->can('delete', $listingItem)) {
            $contextMenu->add([
                'title' => __('frontend.Delete'),
                'action_id' => 'delete',
                'icon' => '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" class="svg-inline--fa fa-xmark " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path></svg>',
            ]);
        }
        $contextMenu->add(['title' => '-']);
        $contextMenu->add([
            'title' => Functions::__('Copy Link'),
            'action_id' => 'copy_permalink',
            'icon' => '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="copy" class="svg-inline--fa fa-copy " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"></path></svg>',
        ]);

        $contextMenu->add([
            'title' => Functions::__('Report'),
            'action_id' => 'report',
            'icon' => '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="flag" class="svg-inline--fa fa-flag " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24V64 350.5 400v88c0 13.3 10.7 24 24 24s24-10.7 24-24V388l80.3-20.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L48 52V24zm0 77.5l96.6-24.2c27-6.7 55.5-3.6 80.4 8.8c54.9 27.4 118.7 29.7 175 6.8V334.7l-24.4 9.1c-33.7 12.6-71.2 10.7-103.4-5.4c-48.2-24.1-103.3-30.1-155.6-17.1L48 338.5v-237z"></path></svg>',
        ]);

        return $contextMenu;
    }

}
