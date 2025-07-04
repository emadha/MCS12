<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ConstantsHelper;
use App\Http\Controllers\Controller;
use App\Http\Middleware\Admin;
use App\Http\Resources\Admin\Users\UserTableRow;
use App\Models\ListingItem;
use App\Models\Settings;
use App\Models\User;
use Barryvdh\Debugbar\Facades\Debugbar;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\View;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

/**
 *
 */
class AdminController extends Controller
{

    /**
     * @var string
     */
    public static string $title;

    /**
     * @var string
     */
    public static string $model;

    /**
     * @var string
     */
    public static string $controller;

    /**
     *
     */
    public function __construct()
    {
        parent::__construct();
        $this->middleware(Admin::class);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        return Inertia::render('Index', [
            'title' => 'Admin Dashboard',
        ]);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Inertia\Response
     */
    public function users(Request $request)
    {
        $data = [
            'title' => 'Users',
            'users' => UserTableRow::collection(User::paginate(10)),

        ];
        View::share($data);
        return Inertia::render('Users/Index', $data);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Inertia\Response
     */
    public function shops(Request $request)
    {
        $data = ['title' => 'Shops'];
        View::share($data);

        return Inertia::render('Shops/Index', $data);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Inertia\Response
     */
    public function listed(Request $request)
    {
        $data = ['title' => 'Listed Items'];
        View::share($data);

        return Inertia::render('Listed/Index', $data);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Inertia\Response
     */
    public function roles_permissions(Request $request)
    {
        $data = [
            'title'       => 'Roles & Permissions',
            'roles'       => Role::all(),
            'permissions' => Permission::all(),
        ];
        View::share($data);

        return Inertia::render('RolesPermissions/Index', $data);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Inertia\Response
     */
    public function settings(Request $request)
    {
        $data = [
            'title'    => 'Settings',
            'settings' => Settings::all()->pluck('value', 'key'),
        ];

        View::share($data);

        return Inertia::render('Settings/Index', $data);
    }

    /**
     * [POST] Store Settings
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function settingsStore(Request $request)
    {
        $allowedKeys = [
            'site_title', 'site_description', 'site_robots',
        ];

        $this->validate($request, [
            'site_title'       => 'required|min:1|max:255',
            'site_description' => 'required|min:10|max:255',
            'site_robots'      => [
                'required',
                Rule::in(array_keys(ConstantsHelper::ROBOTS)),
            ],
        ]);

        $only = $request->only($allowedKeys);

        $updatedSettings = [];

        foreach ($only as $_key => $_value) {
            $settingsUpdate = Settings::updateOrCreate([
                'key' => $_key,
            ], [
                'value'      => $_value,
                'updated_by' => Auth::id(),
            ]);

            if ($settingsUpdate) {
                $updatedSettings[] = $_key;
            }
        }

        return back()->with([
            'status'  => 1,
            'message' => [
                'status'  => 1,
                'message' =>
                    'Settings has been updated',
            ],
            'updates' => $updatedSettings,
        ]);
    }

    public function sitemap(Request $request)
    {
        Debugbar::disable();

        $data = [
            'title'                => 'Sitemap',
            'listing_cars'         => [],
            'listing_cars_lastmod' => null,
            'database_cars'        => [],
            'database_lastmod'     => null,
        ];

        if ($request->get('make') === '1') {
            switch ($request->get('type')) {
                case 'database_cars':
                {
                    break;
                }
                case 'listing_cars':
                {
                    ListingItem::limit(10)->get()->each(function ($item) use (&$data) {
                        $data['listing_cars'][] = [
                            'loc'        => $item->links->permalink,
                            'lastmod'    => $item->created_at->format('c'),
                            'changefreq' => 'never',
                            'priority'   => .9,
                        ];
                    });

                    $viewData = view('sitemap.listing_cars', [
                        'listing_cars' => $data['listing_cars'],
                    ])->render();

                    $data['listing_cars_lastmod'] = Carbon::now()->format('c');
                    file_put_contents(public_path('listing_cars.xml'), $viewData);
                    break;
                }
            }
        }

        View::share($data);
        return Inertia::render('Settings/Sitemap', $data);
    }

}
