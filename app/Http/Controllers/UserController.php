<?php

namespace App\Http\Controllers;

use App\Http\Resources\ListingItem\ListingItemBlocksResource;
use App\Http\Resources\User\UserResource;
use App\Http\Resources\User\UserSearchBoxResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{

    public function usernameCheck(Request $request)
    {
        // Get User by username
        return User::where('username', $request->get('username'))->exists();
    }

    public function single(Request $request, User $user)
    {
        return Inertia::render('User/Single', [
            'title' => $user->first_name,
            'user'  => new UserResource($user),
        ]);
    }

    public function myCars(Request $request)
    {
        if (!Auth::check()) {
            abort(Response::HTTP_UNAUTHORIZED);
        }

        return ListingItemBlocksResource::collection(Auth::user()->cars(10));
    }

    public function myShops(Request $request)
    {
        return Auth::user()->shops()->limit(6)->get();
    }

    public function myShowrooms(Request $request)
    {
        return Auth::user()->showrooms()->approved()->count() ? [
            'status'    => 1,
            'showrooms' => Auth::user()->showrooms()->approved()->select(['id', 'title'])->get(),
        ] : [
            'status'  => -1,
            'message' => 'No Showrooms Found',
        ];
    }

    public function search(Request $request)
    {
        $user = $request->get('user');

        $UserList = User::where('email', 'RLIKE', $user)
            ->whereNot('id', Auth::user()?->id)
            ->limit(10)
            ->get();

        // todo do more actions on UsersList, such as user doesn't allow to be messaged

        return UserSearchBoxResource::collection($UserList);
    }

}
