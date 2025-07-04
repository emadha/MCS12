<?php

namespace App\Http\Controllers;

use App\Helpers\Functions;
use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Resources\Balance\UserBalanceResource;
use App\Models\CreditsCoupons;
use App\Models\Photo;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;
use Inertia\Response;

use function App\Helpers\routes_frontend;

class ProfileController extends Controller
{

    public function single(Request $request) {}

    public function balance(Request $request)
    {
        $data = [
            'title'   => 'Your Balance',
            'balance' =>
                [
                    'sum'  => Auth::user()->balance->sum('amount'),
                    'data' => UserBalanceResource::collection(Auth::user()->balance()->latest()->paginate(10)),
                ],
        ];
        View::share($data);

        return Inertia::render('Profile/Balance', $data);
    }

    public function addBalance(Request $request)
    {
        $data = [
            'title'   => 'Add Balance',
            'credits' => config('credits.prices'),
            'plans'   => config('plans'),
        ];

        View::share($data);

        return Inertia::render('Profile/Balance/Add', $data);
    }

    public function addBalanceStore(Request $request)
    {
        $this->validate($request, [
            'amount' => 'required|int|min:1',
        ]);

        $creditsGiven = BalanceController::giveCreditsToUser(
            $request->user(), $request->get('amount'),
            Functions::__('Balance Added'),
        );

        if ($creditsGiven) {
            return response([
                'status'  => 1,
                'message' => sprintf('User %s has been credited %s',
                    $request->user()->name,
                    $request->get('amount')
                ),
            ]);
        }
    }

    public function redeem(Request $request)
    {
        $data = [
            'title'   => 'Redeem Code',
            'credits' => config('credits.prices'),
        ];

        View::share($data);

        return Inertia::render('Profile/Balance/Redeem', $data);
    }

    public function redeemStore(Request $request)
    {
        $this->validate($request, [
            'code' => [
                'required',
                function ($attribute, $value, $fail) use ($request) {
                    $CreditsCoupon = CreditsCoupons::where(DB::raw('BINARY `code`'), strtoupper($request->get('code')));
                    //->whereNull('redeemed_by');

                    if (!$CreditsCoupon->exists()) {
                        $fail('Invalid coupon code');

                        return;
                    }

                    return true;
                },
            ],
        ]);

        return CreditsCouponsController::redeem($request->get('code'));
    }

    public function deactivate(Request $request)
    {
        $data = ['title' => __('frontend.Deactivate your profile')];
        View::share($data);

        return Inertia::render('Profile/Deactivate', $data);
    }

    public function disconnectGoogle(Request $request)
    {
        $request->user()->google_id = null;
        $request->user()->save();

        Functions::addToSession(1, 'Disconnected from google');

        return back();
    }

    public function connectGoogle(Request $request)
    {
        return \Illuminate\Support\Facades\Response::redirectTo(
            route('login.google')
        );
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $data = [
            'title'           => 'Edit',
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status'          => session('status'),
            'csrf_token'      => csrf_token(),
        ];

        View::share(['title' => 'Edit']);

        return Inertia::render('Profile/Edit', $data);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        if ($request->has('profile_photo')) {
            try {
                $Photo = Photo::where([
                    'id' => decrypt($request->get('profile_photo')),
                ])->whereNull(['item_type', 'item_id'])
                    ->first();

                if (!$Photo) {
                    return back();
                }

                UserPhotoController::storeProfilePicture(
                    $Photo->filename,
                    Storage::disk('temp')->path('orphans'.DIRECTORY_SEPARATOR.$Photo->filename),
                    $request->user()
                );

                $Photo->delete();
            } catch (\Exception|DecryptException $exception) {
                return back()->withErrors(['Photo Not Found #'.__LINE__.';'.$exception->getMessage()]);
            }
        }

        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::to(route('profile.edit'));
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current-password'],
        ], [
            'password.required'         => 'ok',
            'password.current_password' => __('frontend.Invalid Password'),
        ]);

        $user = $request->user();

        $user->deactivate($request);

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Functions::addToSession(1, 'User Deactivated');

        return Redirect::to('/');
    }

}
