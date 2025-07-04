<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Functions;
use App\Http\Controllers\Controller;
use App\Http\Controllers\ListingItemController;
use App\Models\ListingItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Illuminate\Validation\Rules\In;
use Inertia\Inertia;

class AdminListedController extends AdminController
{

    public static string $model = ListingItem::class;

    public static string $controller = ListingItemController::class;

    public static string $title = 'Listed Items';

    public function index(Request $request)
    {
        $data = [
            'title'        => self::$title,
            'listingItems' => ListingItem::paginate(10),
        ];

        View::share(['title' => self::$title]);

        return Inertia::render('Listed/Index', $data);
    }

    public function form(Request $request, ListingItem $listed)
    {
        $data = ['title' => $listed ? "Editing $listed->id" : 'New Car DB Item'];
        return Inertia::render('Listed/Form', $data);
    }

}
