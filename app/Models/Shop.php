<?php

namespace App\Models;

use App\Http\Controllers\ShopController;
use App\Traits\HasActivity;
use App\Traits\HasAlbums;
use App\Traits\HasBadges;
use App\Traits\HasComments;
use App\Traits\HasContact;
use App\Traits\HasFavorites;
use App\Traits\HasLocation;
use App\Traits\HasPermalink;
use App\Traits\HasPhotos;
use App\Traits\HasPromotion;
use App\Traits\HasReviews;
use App\Traits\HasStats;
use App\Traits\HasUser;
use App\Traits\HasUsername;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use stdClass;

/**
 * @property int $id
 * @property string $title
 * @property MorphMany $albums
 * @property BelongsToMany $types
 * @property bool $is_approved
 * @property bool $is_published
 * @property bool $is_active
 * @method Shop published()
 * @method Shop active()
 */
class Shop extends Base
{

    use HasActivity,
        HasAlbums,
        HasBadges,
        HasComments,
        HasContact,
        HasFactory,
        HasFavorites,
        HasLocation,
        HasPermalink,
        HasPhotos,
        HasPromotion,
        HasReviews,
        HasStats,
        HasUser,
        HasUsername,
        SoftDeletes;

    /**
     * @var string
     */
    public static string $controller = ShopController::class;

    /**
     * @var string[]
     */
    protected $fillable
        = [
            'user_id',
            'username',
            'title',
            'description',
            'opening_hour',
            'closing_hour',
            'opening_days',
            'predefined_location',
            'is_open',
            'is_active',
        ];

    /**
     * @var string[]
     */
    protected $casts
        = [
            'opening_days' => 'array',
            'established_at' => 'date'
        ];

    /**
     * @var string[]
     */
    protected $appends = ['display', 'link'];

    /**
     * @param Builder $query
     * @param array $types
     *
     * @return void
     */
    public function scopeType(Builder $query, array $types): void
    {
        $query->whereHas('types', function ($q) use ($types) {
            $q->whereIn('type', $types);
        });
    }

    /**
     * @param Builder $query
     *
     * @return void
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('is_published', true);
    }

    /**
     * @param Builder $query
     * @param bool $is_active
     *
     * @return void
     */
    public function scopeActive(Builder $query, bool $is_active = true): void
    {
        $query->where('is_active', $is_active);
    }

    /**
     * @param Builder $query
     *
     * @return void
     */
    public function scopeApproved(Builder $query): void
    {
        $query->where('is_approved', true);
    }

    public function scopeNotApproved(Builder $query): void
    {
        $query->where('is_approved', false);
    }

    /**
     * @return \stdClass
     */
    public function getLinksAttribute(): stdClass
    {
        $links = parent::getLinksAttribute();
        $links->item = route('shop.single', $this->id);

        return $links;
    }

    /**
     * @return BelongsToMany
     */
    public function types(): BelongsToMany
    {
        return $this->belongsToMany(ShopType::class, 'shop_shop_type');
    }

    /**
     * @return BelongsToMany
     */
    public function verifiedTypes(): BelongsToMany
    {
        return $this
            ->belongsToMany(ShopType::class, 'shop_shop_type')
            ->whereNotNull('verified_at');
    }

    /**
     * @return string|void
     */
    public function getLinkAttribute()
    {
        if ($this->id) {
            return route('shop.single', $this->id);
        }
    }

    /**
     * @return stdClass
     */
    public function getDisplayAttribute(): stdClass
    {
        $display = new stdClass();
        $display->title = $this->title;
        $display->type = collect($this->types->map(fn($item) => $item->title))->implode(', ');

        return $display;
    }

    /**
     * @return HasMany
     */
    public function listingItems(): HasMany
    {
        return $this->hasMany(ListingItem::class, 'shop_id')->latest();
    }

    /**
     * @return bool
     */
    public function activate(): bool
    {
        $this->is_active = true;

        return $this->save();
    }

    /**
     * @return bool
     */
    public function deactivate(): bool
    {
        $this->is_active = false;

        return $this->save();
    }

    /**
     * @return bool
     */
    public function publish(): bool
    {
        $this->is_published = true;

        return $this->save();
    }

    /**
     * @return bool
     */
    public function unpublish(): bool
    {
        $this->is_published = false;

        return $this->save();
    }

    /**
     * @return bool
     */
    public function approve(): bool
    {
        $this->is_approved = true;

        return $this->save();
    }

    /**
     * @return bool
     */
    public function disapprove(): bool
    {
        $this->is_approved = false;

        return $this->save();
    }

}
