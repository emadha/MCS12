<?php

namespace App\Http\Controllers\OAuth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\UserPhotoController;
use App\Models\User;
use App\Notifications\UserRegisteredUsingSocialite;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Laravel\Socialite\AbstractUser;
use Laravel\Socialite\Facades\Socialite;


/**
 *
 */
class SocialiteLogin extends Controller
{

    /**
     *
     */
    public function __construct()
    {
    }

    //    public function loginUsingFacebook(Request $request): \Symfony\Component\HttpFoundation\RedirectResponse|RedirectResponse {
    //        return Socialite::driver('facebook')->redirect();
    //    }

    /**
     * @param Request $request
     *
     * @return mixed
     */
    public function loginUsingGoogle(Request $request): mixed
    {
        return Socialite::driver('google')
            ->with(['redirect_url' => config('services.google.redirect')])->redirect();
    }

    /**
     * @param Request $request
     *
     * @return mixed
     */
    public function loginUsingMicrosoft(Request $request)
    {
        return Socialite::driver('microsoft')->with(['redirect_url' => config('services.microsoft.redirect')])->redirect();
    }

    /**
     * @param Request $request
     *
     * @return RedirectResponse
     */
    public function callbackFromGoogle(Request $request): RedirectResponse
    {
        try {
            $socialiteUser = Socialite::driver('google')->user();
            $callbackUser = $this->updateOrCreateSocialiteUser($socialiteUser, 'google_id');

            if ($callbackUser->wasRecentlyCreated) {
                UserPhotoController::setUserProfilePictureFromGoogle($request, $callbackUser, $socialiteUser);
            }

            // Authenticate User
            Auth::login($callbackUser);
        } catch (Exception $exception) {
            return response()->redirectTo(route('index'))->with(['Google login failed']);
        }

        return Redirect::back();
    }

    /**
     * @param Request $request
     *
     * @return RedirectResponse
     */
    public function callbackFromMicrosoft(Request $request): RedirectResponse
    {
        try {
            $socialiteUser = Socialite::driver('microsoft')->user();
            $callbackUser = $this->updateOrCreateSocialiteUser($socialiteUser, 'microsoft_id');
            UserPhotoController::setUserProfilePictureFromMicrosoft($request, $callbackUser, $socialiteUser);

            // Authenticate User
            Auth::login($callbackUser);
        } catch (Exception $exception) {
            return response()->redirectTo(route('index'))->with(['Google login failed']);
        }

        return Redirect::to('/');
    }

    /**
     * @param $socialiteUser
     * @param $id_column
     *
     * @return User
     * @throws Exception
     */
    private function updateOrCreateSocialiteUser(AbstractUser $socialiteUser, $id_column): User
    {
        $name = explode(' ', $socialiteUser->getName());

        $newPassword = Str::random(10);

        /** @var User $user */
        $user = User::withTrashed()->updateOrCreate(
            ['email' => $socialiteUser->getEmail()],
            [
                'first_name' => $name[0],
                'last_name' => $name[1],
                $id_column => $socialiteUser->getId(),
                'email' => $socialiteUser->getEmail(),
                'password' => bcrypt($newPassword),
                'password_length' => strlen($newPassword),
                'email_verified_at' => now(),
            ]
        );

        if ($user->trashed()) {
            $user->restore();
        }

        // Send Email only when the user was recently created
        if ($user->wasRecentlyCreated) {
            $user->notifyNow(new UserRegisteredUsingSocialite($newPassword));
        }

        return $user;
    }

}
