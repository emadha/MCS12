<?php

namespace App\Http\Controllers;

use App\Http\Resources\Shop\ShopResource;
use App\Models\Shop;
use App\Models\ShopType;
use App\Models\Showroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;


class ShowroomController extends Controller
{

    public function index(Request $request)
    {
        return Inertia::render('Showroom/Index', [
            'title'     => 'Showrooms',
            'showrooms' => ShopResource::collection(Shop::type([ShopType::TYPE_SHOWROOM])->limit(20)->get()),
        ]);
    }

    public function single(Request $request, Shop $frontend_showroom)
    {
        return Inertia::render('Shops/Single', [
            'title'    => $frontend_showroom->title,
            'shop'     => new ShopResource($frontend_showroom),
            'listings' => [],
        ]);
    }

    public function my(Request $request)
    {
        return Inertia::render('Showroom/My', [
            'title'     => __('showrooms.my'),
            'showrooms' => Auth::user()->showrooms,
        ]);
    }

    public function form(Request $request)
    {
        return Inertia::render('Showroom/Form', [
            'title' => __('showrooms.create'),
        ]);
    }

    public function store(Request $request, Showroom $showroom)
    {
        $request->request->add(['user_id' => Auth::user()->id]);

        $this->validate($request, [
            'title'       => [
                'required',
                'min:4',
                'max:20',
                'unique:showrooms,title,user_id',
            ],
            'description' => 'required|min:2|max:500',
            'user_id'     => 'required|exists:users,id',
        ], [
            'title.unique' => 'You already have a showroom with this name.',
        ]);

        $storedShowroom = $showroom->updateOrCreate(['id' => $showroom->id],
            $request->all()
        );

        return Redirect::to(route('showroom.single', $storedShowroom))->with('status', 'ok');
    }

}
