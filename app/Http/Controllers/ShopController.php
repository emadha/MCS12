<?php

namespace App\Http\Controllers;

use App\Enum\ContactMethodEnum;
use App\Enum\StatsEnum;
use App\Helpers\Functions;
use App\Http\Resources\ListingItem\ListingItemBlocksResource;
use App\Http\Resources\PredefinedLocation\PredefinedLocationResouce;
use App\Http\Resources\Shop\ShopFormResource;
use App\Http\Resources\Shop\ShopResource;
use App\Http\Resources\Shop\StatsGroupResource;
use App\Http\Resources\Shop\StatsResource;
use App\Models\Photo;
use App\Models\PredefinedLocation;
use App\Models\Shop;
use App\Models\ShopType;
use App\Rules\ContactRule;
use Exception;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

/**
 *
 */
class ShopController extends Controller
{

    /**
     * @param Request $request
     *
     * @return Response
     */
    public function index(Request $request): Response
    {
        return Inertia::render('Shops/Index', [
            'title' => 'Shop',
            'types' => ShopType::select(['title', 'id'])
                ->get()
                ->setVisible([])
                ->toArray(),
            'predefined_locations' => PredefinedLocationResouce::collection(PredefinedLocation::where(['region' => config('site.regions.current')])
                ->get()),
        ]);
    }

    /**
     * @param Request $request
     * @param \App\Models\Shop $shop_frontend_page
     *
     * @return Response
     * @throws \Exception
     */
    public function single(
        Request $request,
        Shop    $shop_frontend_page
    ): Response
    {
        # Add Visit Stat
        StatsController::create(
            StatsEnum::VIEW->name,
            $shop_frontend_page,
            Auth::user(),
            'ShopController'
        );

        $shopListedCars = $shop_frontend_page
            ->listingItems()
            ->typeCars()
            ->with(['item.car'])
            ->get();

        $shopListedCarsUniqueMakes = $shopListedCars
            ->unique('item.car.make')
            ->pluck('item.car.make', 'item.car.make_slug')->toArray();

        $shopListedCarsUniqueModels = $shopListedCars
            ->unique('item.car.model')
            ->pluck('item.car.model', 'item.car.model_slug')
            ->toArray();

        ksort($shopListedCarsUniqueMakes);
        ksort($shopListedCarsUniqueModels);

        $data = [
            'title' => $shop_frontend_page->title,
            'shop' => new ShopResource($shop_frontend_page),
            'unique_makes' => $shopListedCarsUniqueMakes,
            'unique_models' => $shopListedCarsUniqueModels,
        ];

        View::share($data);
        return Inertia::render('Shops/Single', $data);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Shop $shop_frontend_page
     *
     * @return \Inertia\Response
     */
    public function stats(Request $request, Shop $shop_frontend_page)
    {
        if (!$request->user()?->can('viewStats', $shop_frontend_page)) {
            abort(ResponseAlias::HTTP_UNAUTHORIZED);
        };

        $data = [
            'title' => $shop_frontend_page->title . ' stats',
            'shop' => $shop_frontend_page,
            'stats' => new StatsResource(Shop::where('id', $shop_frontend_page->id)->first()),
            'links' => [
                'back' => route('shop.single', $shop_frontend_page->id),
            ],
        ];

        View::share($data);
        return Inertia::render('Shops/Stats', $data);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Shop $shop_frontend_page
     * @param string $date
     *
     * @return \Inertia\Response
     */
    public function statsSingle(Request $request, Shop $shop_frontend_page, string $date)
    {
        if (!$request->user()?->can('viewStats', $shop_frontend_page)) {
            abort(ResponseAlias::HTTP_UNAUTHORIZED);
        };

        $data = [
            'title' => $shop_frontend_page->title . ' stats for ' . $date,
            'shop' => $shop_frontend_page,
            'stats' => new StatsGroupResource(Shop::where('id', $shop_frontend_page->id)->first(), $date),
            'links' => [
                'back' => route('shop.single.stats', $shop_frontend_page->id),
            ],
        ];

        View::share($data);
        return Inertia::render('Shops/Stats/Single', $data);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param int $shop_id
     *
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function listings_cars(Request $request, Shop $shop_id)
    {
        $items_limit = 50;

        /** @var Shop $shop */
        $shop = Shop::where(['id' => $shop_id])->first();

        $makes = is_array($request->get('make')) ? $request->get('make') : [];
        $models = is_array($request->get('model')) ? $request->get('model') : [];

        $listingItemsCars = $shop->listingItems()->with([
            'shop.contacts',
            'shop.permalink',
            'shop.location',
            'shop.types',
            'shop.user.photos',
            'favorites',
            'shop.favorites',
            'item.permalink',
            'photos',
            'shop.photos',
            'user.photos',
            'shop.user.photos',
        ])->typeCars(
            make: $makes,
            model: $models
        );

        /** @var LengthAwarePaginator $listingItemsBlocksResource */
        $listingItemsBlocksResource = ListingItemBlocksResource::collection(
            $listingItemsCars->paginate($items_limit)
        );

        $listingItemsBlocksResource->setPath(route('shop.single', ['shop_frontend_page' => $shop->id, 't' => 'cars']));

        return $listingItemsBlocksResource;
    }

    /**
     * @param Request $request
     * @param Shop $shop
     *
     * @return Response
     */
    public function form(Request $request, Shop $shop): Response
    {
        if ($shop->id && !$request->user()->can('edit', $shop)) {
            abort(ResponseAlias::HTTP_UNAUTHORIZED);
        }

        $data = [
            'title' => $shop->id ? "Edit $shop->title Shop" : Functions::__('Create a New Shop'),
            'shop' => new ShopFormResource($shop),
            'types' => ShopType::select(['title', 'id'])
                ->get()
                ->setVisible([])
                ->toArray(),
            'contacts' => $shop->contacts,
            'contactMethods' => ContactMethodEnum::names(),
            'predefined_locations' => PredefinedLocationResouce::collection(PredefinedLocation::where(['region' => config('site.regions.current')])
                ->get()),
            'csrf_token' => csrf_token(),
        ];

        View::share($data);

        return Inertia::render('Shops/Form', $data);
    }

    /**
     * @param Request $request
     * @param Shop $shop
     *
     * @return RedirectResponse
     * @throws ValidationException
     */
    public function store(Request $request, Shop $shop): RedirectResponse
    {
        // fixme maybe make a different rule for new shops
        if ($shop->id && !$request->user()->can('edit', $shop)) {
            abort(ResponseAlias::HTTP_UNAUTHORIZED);
        }

        if (!$request->user()->can('pay', $shop)) {
            return Redirect::to(route('shop.store'))->withErrors([
                [
                    'You do not have enough credits to start a new shop, minimum required is ' .
                    config('credits.prices.create_shop') . ' credits',
                ],
            ]);
        }

        $request->request->add(['user_id' => Auth::user()->id]);

        if ($request->get('profile_photo')) {
            try {
                $request->request->add(['profile_photo' => decrypt($request->get('profile_photo'))]);
            } catch (DecryptException|Exception) {
                return back()->withErrors(['profile_photo' => 'Invalid Shop Photo']);
            }
        }

        if ($request->has('predefined_location') && array_key_exists('id',
                $request->get('predefined_location'))) {
            $request->request->add(['predefined_location' => $request->get('predefined_location')['id']]);
        }

        if ($request->has('location') && is_array($request->get('location')) && count($request->get('location')) >= 0) {
            $request->request->add(['location' => $request->get('location')[0]]);
        }

        $request->request->add(['region' => config('site.regions.current')]);

        $validationRules = [
            'title' => [
                'required',
                'min:4',
                'max:20',
                'unique:shops,title,' . $shop?->id,
            ],
            'description' => 'required|min:2|max:2000',
            'user_id' => 'required|exists:users,id',
            'types' => 'required|exists:shop_types,id',
            'region' => 'required|exists:predefined_locations,region',
            'predefined_location' => 'required|exists:predefined_locations,id,id,'
                . $request->get('predefined_location')
                . ',region,'
                . $request->get('region'),
            'contacts' => ['required', new ContactRule()],
            'location' => 'required',
        ];

        if (!$shop->id) {
            $validationRules['profile_photo'] = 'required|exists:photos,id';
            $validationRules['username'] = [
                'nullable', 'max:30',
                'unique:usernames,username',
                'regex:/^[A-Za-z0-9_.]+$/u',
            ];
        } else {
            $validationRules['username'] = [
                'nullable', 'max:30',
                'unique:usernames,username,' . $shop?->username?->id,
                'regex:/^[A-Za-z0-9_.]+$/u',
            ];
            $validationRules['profile_photo'] = 'nullable|exists:photos,id';
        }

        // Validation Messages
        $this->validate($request, $validationRules, [
            'contacts.required' => 'You need to specify at least one contact method.',
        ]);

        if ($shop->id) {
            $request->request->remove('username');
        }

        $Photo = null;

        // Get Photo
        if ($request->get('profile_photo')) {
            $Photo = Photo::where([
                'id' => $request->get('profile_photo'),
                'item_type' => null,
                'item_id' => null,
            ])->first();

            if (!$Photo) {
                return back()->withErrors(['Photo Not Found #' . __LINE__]);
            }

            // Move the photos from temp to live
            $tempFile = 'temp_photos/orphans/' . $Photo->filename;
            if (Storage::disk('shops')->putFileAs(
                $shop->id, Storage::path($tempFile), $Photo->filename)
            ) {
                Storage::disk('orphans')->delete($Photo->filename);
            }

        }

        $request->request->add(['region' => config('site.regions.current')]);

        /** @var Shop $storedShop */
        $storedShop = $shop->updateOrCreate(['id' => $shop->id],
            $request->only([
                'title',
                'description',
                'user_id',
                'predefined_location',
            ]));

        if (!$storedShop) {
            return back()->withErrors(['Error creating shop #' . __LINE__]);
        }

        $storedShop->types()->sync($request->get('types'));

        # Delete previous contacts
        $storedShop->contacts()->delete();
        # Create new contacts
        collect($request->get('contacts'))
            ->filter(fn($contact) => $contact['value'])
            ->each(function ($contact) use ($storedShop) {
                $storedShop->contacts()->updateOrCreate([
                    'method' => $contact['method'],
                    'value' => $contact['value'],
                ], [
                    'method' => $contact['method'],
                    'value' => $contact['value'],
                ]);
            });

        # Set Geo Location
        if ($request->has('location') &&
            isset($request->get('location')['geometry']['location']['lng']) &&
            isset($request->get('location')['geometry']['location']['lat']) &&
            isset($request->get('location')['formatted_address'])) {

            $storedShop->location()->delete();
            $storedShop->location()->create([
                'long' => $request->get('location')['geometry']['location']['lng'],
                'lat' => $request->get('location')['geometry']['location']['lat'],
                'address' => $request->get('location')['formatted_address'],
                'address_object' => $request->get('location'),
            ]);
        }

        # Profile Photo
        if ($Photo && $request->get('profile_photo')) {
            // Delete previous photo(s), mainly one
            $shop->photos()->delete();

            $storedShop->setPhotoToPrimary($Photo);
        }

        // Create username
        if (!$shop->id && $request->get('username')) {
            $storedShop->username()
                ->create(['username' => $request->get('username')]);
        }

        return Redirect::route('shop.single', $storedShop)
            ->with('status', 'Shop has been created');
    }

    /**
     * @param Request $request
     * @param Shop $shop
     *
     * @return array|null
     */
    public function toggleFavorite(Request $request, Shop $shop): ?array
    {
        //dd($listing->id);
        return $shop->toggleFavorite();
    }

    /**
     * @param Request $request
     *
     * @return void
     * @throws ValidationException
     */
    public function usernameCheck(Request $request): void
    {
        $this->validate($request, [
            'username' => [
                'required',
                'max:30',
                'regex:/^[A-Za-z0-9_.]+$/u',
                'unique:usernames,username',
                // todo Move that to a Username Model, because username should be global and not for shops only
            ],
        ]);
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Shop $shop
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response
     */
    public function action_delete(
        Request $request,
        shop    $shop
    ): \Illuminate\Foundation\Application|\Illuminate\Http\Response|Application|ResponseFactory
    {
        if (!$request->user()->can('delete', $shop)) {
            return response([
                'status' => -1,
                'message' => __('Unauthorized'),
            ], ResponseAlias::HTTP_UNAUTHORIZED);
        }

        if ($shop->delete()) {
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
     * @param \App\Models\Shop $shop
     *
     * @return array|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response
     */
    public function action_approve(Request $request, Shop $shop)
    {
        if (!$request->user()->can('approve', $shop)) {
            return response([
                'status' => -1,
                'message' => __('Unauthorized'),
            ], ResponseAlias::HTTP_UNAUTHORIZED);
        }

        if ($shop->approve()) {
            return [
                'status' => 1,
                'message' => 'Shop approved!',
                'updatedItem' => new ShopResource($shop->fresh()),
            ];
        } else {
            return ['status' => 0, 'message' => 'Could not approve this shop'];
        }
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Shop $shop
     *
     * @return array
     */
    public function action_disapprove(Request $request, Shop $shop)
    {
        if ($shop->disapprove()) {
            return [
                'status' => 1,
                'message' => 'Shop disapproved!',
                'updatedItem' => new ShopResource($shop->fresh()),
            ];
        } else {
            return [
                'status' => 0,
                'message' => 'Could not disapprove this shop',
            ];
        }
    }

    public function action_review(Request $request, Shop $shop)
    {
        dd('o');
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Shop $shop
     *
     * @return \Illuminate\Support\Collection
     */
    public function contextMenu(Request $request, Shop $shop)
    {
        $contextMenu = collect();

        if ($request->user()?->can('edit', $shop)) {
            $contextMenu->add([
                'title' => __('frontend.Edit'),
                'action_id' => 'edit',

            ]);
        }
        if ($request->user()?->can('list', $shop) && $shop->types->where('type', ShopType::TYPE_SHOWROOM)->count()) {
            $contextMenu->add([
                'title' => __('frontend.List a Car'),
                'action_id' => 'list_item',
            ]);
        }

        if ($request->user()?->can('approve', $shop) && !$shop->is_approved) {
            $contextMenu->add([
                'title' => __('frontend.Approve'),
                'action_id' => 'approve',
                'icon' => '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="pen-to-square" class="svg-inline--fa fa-pen-to-square " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"></path></svg>',
            ]);
        } elseif ($request->user()?->can('disapprove', $shop) && $shop->is_approved) {
            $contextMenu->add([
                'title' => __('frontend.Disapprove'),
                'action_id' => 'disapprove',
                'icon' => '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="pen-to-square" class="svg-inline--fa fa-pen-to-square " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"></path></svg>',
            ]);
            $contextMenu->add(['title' => '-']);
        }

        if ($request->user()?->can('delete', $shop)) {
            $contextMenu->add([
                'title' => __('frontend.Delete'),
                'action_id' => 'delete',
                'icon' => '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" class="svg-inline--fa fa-xmark " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path></svg>',
            ]);
        }

        if ($request->user()?->can('publish', $shop) && !$shop->is_published) {
            $contextMenu->add([
                'title' => __('frontend.Publish'),
                'action_id' => 'publish',
                'icon' => '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" class="svg-inline--fa fa-xmark " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path></svg>',
            ]);
        }

        if ($request->user()?->can('unpublish', $shop) && $shop->is_published) {
            $contextMenu->add([
                'title' => __('frontend.Unpublish'),
                'action_id' => 'unpublish',
                'icon' => '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" class="svg-inline--fa fa-xmark " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path></svg>',
            ]);
        }

        $contextMenu->add([
            'title' => __('frontend.Report'),
            'action_id' => 'report',
            'icon' => '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="flag" class="svg-inline--fa fa-flag " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24V64 350.5 400v88c0 13.3 10.7 24 24 24s24-10.7 24-24V388l80.3-20.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L48 52V24zm0 77.5l96.6-24.2c27-6.7 55.5-3.6 80.4 8.8c54.9 27.4 118.7 29.7 175 6.8V334.7l-24.4 9.1c-33.7 12.6-71.2 10.7-103.4-5.4c-48.2-24.1-103.3-30.1-155.6-17.1L48 338.5v-237z"></path></svg>',
        ]);

        return $contextMenu;
    }

}
