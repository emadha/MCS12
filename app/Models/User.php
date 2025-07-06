<?php

namespace App\Models;

use App\Enum\ProfileStatus;
use App\Observers\UserObserver;
use App\Traits\HasAlbums;
use App\Traits\HasFollowers;
use App\Traits\HasGarage;
use App\Traits\HasPhotos;
use App\Traits\HasShowroom;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Laravel\Sanctum\HasApiTokens;
use NotificationChannels\WebPush\HasPushSubscriptions;
use Spatie\Permission\Traits\HasPermissions;
use Spatie\Permission\Traits\HasRoles;
use stdClass;

/**
 * @property int $id
 * @property HasMany $shops
 * @property string|null $first_name
 * @property HasMany $credits
 * @method static Model|Collection|Builder[]|Builder|null find(mixed $id, array|string $columns = ['*'])  find(array|bool|string|null $id)
 */
#[ObservedBy([UserObserver::class])]
class User extends Authenticatable implements MustVerifyEmail
{

    use HasApiTokens,
        HasFactory,
        Notifiable,
        HasAlbums,
        HasPhotos,
        HasShowroom,
        HasPermissions,
        HasRoles,
        HasGarage,
        HasPushSubscriptions,
        HasFollowers,
        SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable
        = [
            'first_name',
            'last_name',
            'email',
            'password',
            'generated_password',
            'password_length',
            'meta_id',
            'google_id',
            'microsoft_id',
            'timezone',
            'deleted_at',
        ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden
        = [
            'password',
            'remember_token',
        ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts
        = [
            'email_verified_at' => 'datetime',
            'activity_at' => 'datetime',
            'login_at' => 'datetime',
        ];

    public function scopeCanBeMessaged(Builder $q)
    {
        $q->whereHas('userPrefs', function ($q) {
        });
    }

    public function scopeIsActive(Builder $q)
    {
        $q->where('status', ProfileStatus::ACTIVE->name);
    }

    public function activate()
    {
        $this->status = ProfileStatus::ACTIVE->name;
        $this->save();
    }

    public function deactivate()
    {
        $this->status = ProfileStatus::DEACTIVATED->name;
        $this->save();
    }

    /**
     * @return \stdClass
     */
    public function getDisplayAttribute(): stdClass
    {
        $display = new stdClass();
        $display->name = "Guest";

        if (!$this->id) {
            return $display;
        }

        $display->name = $this->first_name . ' ' . $this->last_name;

        return $display;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function profilePicture(): HasOne
    {
        return $this->hasOne(UserPhoto::class);
    }

    /**
     * @return false|string
     */
    public function getProfilePicturePathAttribute(): false|string
    {
        $ProfilePicture = $this->profilePicture;
        if (!$ProfilePicture) {
            return false;
        }

        return asset(
            'assets/photos/u/'
            . $ProfilePicture?->filename
        );
    }

    public function userPrefs()
    {
        return $this->hasMany(UserPref::class, 'user_id');
    }

    public function listingItems()
    {
        return $this->hasMany(ListingItem::class);
    }

    /**
     * @param int|null $limit
     *
     * @return mixed
     */
    public function cars(?int $limit = null)
    {
        # Get ListItemCars where user id === $this->id
        return ListingItem::typeCars()
            ->where('user_id', $this->id)
            ->limit($limit);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function shops(): HasMany
    {
        return $this->hasMany(Shop::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function showrooms(): Builder|HasMany
    {
        return $this->shops()->whereHas('types', function ($q) {
            $q->where('type', ShopType::TYPE_SHOWROOM);
        });
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function balance(): HasMany
    {
        return $this->hasMany(Credit::class);
    }

    /**
     * @return mixed
     */
    public function getCreditsSumAttribute(): mixed
    {
        return $this->credits->sum('amount');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function message(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function availableShopTypes(): Collection
    {
        return $this->shops->pluck('types.*.title')->flatten()->unique();
    }

}
