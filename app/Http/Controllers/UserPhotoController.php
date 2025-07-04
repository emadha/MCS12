<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Laravel\Socialite\AbstractUser;

/**
 *
 */
class UserPhotoController extends Controller
{

    //

    /**
     * @param  Request  $request
     * @param  User  $user
     * @param  AbstractUser  $socialiteUser
     *
     * @return void
     */
    public static function setUserProfilePictureFromFacebook(Request $request, User $user, AbstractUser $socialiteUser): void
    {
        self::storeProfilePicture(
            'facebook_'.$user->id.'_'.$socialiteUser->getId().'.jpg',
            $socialiteUser->getAvatar().'&access_token='.$socialiteUser->token,
            $user
        );
    }

    /**
     * @param  Request  $request
     * @param  User  $user
     * @param  AbstractUser  $socialiteUser
     *
     * @return void
     */
    public static function setUserProfilePictureFromGoogle(Request $request, User $user, AbstractUser $socialiteUser): void
    {
        self::storeProfilePicture(
            'google_'.$user->id.'_'.$socialiteUser->getId().'.jpg',
            $socialiteUser->getAvatar(),
            $user
        );
    }

    /**
     * @param  Request  $request
     * @param  User  $user
     * @param  AbstractUser  $socialiteUser
     *
     * @return void
     */
    public static function setUserProfilePictureFromMicrosoft(Request $request, User $user, AbstractUser $socialiteUser): void
    {
        self::storeProfilePicture(
            'microsoft_'.$user->id.'_'.$socialiteUser->getId().'.jpg',
            $socialiteUser->getAvatar(),
            $user
        );
    }

    /**
     * @param  string  $storedProfilePictureFileName
     * @param  string|null  $profile_picture_url
     * @param  User  $user
     *
     * @return void
     */
    public static function storeProfilePicture(string $storedProfilePictureFileName, ?string $profile_picture_url, User $user): void
    {
        if (!$profile_picture_url) {
            return;
        }

        if (Storage::drive('users')->put(
            $storedProfilePictureFileName,
            file_get_contents($profile_picture_url)
        )
        ) {
            $UserPhoto = UserPhoto::find($user->id);

            if ($UserPhoto) {
                $UserPhoto->delete();
            }

            $user->profilePicture()->create(['filename' => $storedProfilePictureFileName, 'is_profile' => 1]);
        }
    }

}
