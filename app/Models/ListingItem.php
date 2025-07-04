<?php

namespace App\Models;

use App\Helpers\Functions;
use App\Http\Controllers\ListingItemController;
use App\Http\Controllers\PermalinkController;
use App\Traits\HasActivity;
use App\Traits\HasComments;
use App\Traits\HasContact;
use App\Traits\HasFavorites;
use App\Traits\HasInteractions;
use App\Traits\HasLocation;
use App\Traits\HasPhotos;
use App\Traits\HasPromotion;
use App\Traits\HasUser;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use stdClass;

/**
 * @property int $id
 * @property int $condition
 * @property int $user_id
 * @property BelongsTo $user
 * @property string $currency
 * @property MorphTo $item
 * @property Carbon $sold_at
 * @property Carbon $created_at
 * @property int $is_approved
 * @method \Illuminate\Database\Query\Builder whereHas(string $string, Closure $param)
 * @method \Illuminate\Database\Query\Builder static whereHasMorph(string $string, string $class, \Closure $param)
 * @method static Builder orphan()
 * @method toggleFavorite()
 * @method static typeCars(string $string)
 * @method static notSold()
 */
class ListingItem extends Base implements \Illuminate\Contracts\Auth\Access\Authorizable
{

    use HasFactory,
        HasActivity,
        HasUser,
        HasPhotos,
        HasLocation,
        HasContact,
        Authorizable,
        HasFavorites,
        HasComments,
        HasInteractions,
        HasPromotion,
        SoftDeletes;

    /**
     * @var string
     */
    public static string $controller = ListingItemController::class;

    /**
     * @var string[]
     */
    protected $fillable
        = [
            'user_id',
            'condition',
            'description',
            'currency',
            'price',
            'shop_id',
            'views',
            'is_approved',
            'is_published',
            'item_type',
            'item_id',
            'predefined_location',
            'sold_at',
        ];

    /**
     * @var string[]
     */
    protected $relations = ['favorites'];

    public $timestamps = ['sold_at'];

    /**
     *
     */
    const CURRENCIES
        = [
            0 => 'USD',
            1 => 'LBP',
            2 => 'AED',
            3 => 'SAR',
            4 => 'AUD',
        ];

    /**
     *
     */
    const CURRENCIES_USD = 0;

    /**
     *
     */
    const CURRENCIES_LBP = 1;

    /**
     *
     */
    const CURRENCIES_AED = 2;

    /**
     *
     */
    const CURRENCIES_SAR = 3;

    /**
     *
     */
    const CURRENCIES_AUD = 4;

    /**
     *
     */
    const CONDITIONS
        = [
            0 => 'Unspecified',
            1 => 'Wrecked',
            2 => 'Not Bad',
            3 => 'Good',
            4 => 'Very Good',
            5 => 'Excellent',
            6 => 'New',
        ];

    const CONDITION_UNSPECIFIED = 0;

    const CONDITION_WRECKED = 1;

    const CONDITION_NOT_BAD = 2;

    const CONDITION_GOOD = 3;

    const CONDITION_VERY_GOOD = 4;

    const CONDITION_EXCELLENT = 5;

    const CONDITION_NEW = 6;

    /**
     *
     */
    const DISPLAY_TYPES
        = [
            'App\Models\ListingItemsCar' => 'car',
        ];

    /**
     *
     */
    const TYPES
        = [
            0 => ListingItemsCar::class,
        ];

    /**
     *
     */
    const TYPE_CAR = 0;

    /**
     * @param Builder $query
     *
     * @return void
     */
    public function scopeTypeCars(Builder $query, $make = [], $model = []): void
    {
        $query->where('item_type', ListingItemsCar::class)
            ->whereHas('item.car', function ($q) use ($make, $model) {
                if (!empty($make)) {
                    $q->whereIn('make_slug', $make);
                }

                if (!empty($model)) {
                    $q->whereIn('model_slug', $model);
                }
            });
    }

    public function scopeApproved(Builder $query)
    {
        $query->where('is_approved', 1);
    }

    public function scopeNotApproved(Builder $query)
    {
        $query->whereNot('is_approved', 1);
    }

    public function approve()
    {
        $this->is_approved = 1;

        return $this->save();
    }

    public function disapprove()
    {
        $this->is_approved = 0;

        return $this->save();
    }

    /**
     * @param Builder $query
     *
     * @return void
     */
    public function scopePromoted(Builder $query): void
    {
        $query->whereHas('promotions')->inRandomOrder();
    }

    /**
     * @param Builder $query
     *
     * @return void
     */
    public function scopeMine(Builder $query): void
    {
        $query->where('user_id', Auth::user()?->id);
    }

    /**
     * @param Builder $query
     *
     * @return void
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('published', 1);
    }

    /**
     * @param Builder $query
     *
     * @return void
     */
    public function scopeSold(Builder $query): void
    {
        $query->whereNotNull('sold_at');
    }

    /**
     * @param Builder $query
     *
     * @return void
     */
    public function scopeNotSold(Builder $query): void
    {
        $query->whereNull('sold_at');
    }

    /**
     * @param Builder $query
     * @param           $from
     * @param           $to
     *
     * @return void
     */
    public function scopePriceRange(Builder $query, $from, $to): void
    {
        $query->where('price', '>', $from)
            ->where('price', '<', $to);
    }

    /**
     * @param Builder $builder
     *
     * @return void
     */
    public function scopeOrphan(Builder $builder): void
    {
        $builder->doesntHave('shop');
    }

    public function unpublish()
    {
        $this->published = false;

        return $this->save();
    }

    public function publish()
    {
        $this->published = true;

        return $this->save();
    }

    /**
     * @return string
     */

    /**
     * @return stdClass
     */
    public function getLinksAttribute(): stdClass
    {
        $links = parent::getLinksAttribute();
        unset($links->relative);
        $links->item = null;

        if ($this->id) {
            if ($this->item) {
                $links->item = $this->item->links->item;

                $itemPermalink = $this->item->permalink;

                if (!$this->item->permalink) {
                    $itemPermalink = PermalinkController::generateUniquePermalink($this->item);
                }

                $links->permalink = route('permalink.single', $itemPermalink?->url);
            }

            $links->edit = route('listing.single.edit', $this->id);
            $links->delete = route('listing.single.delete', $this->id);
        }

        return $links;
    }

    /**
     * @return \stdClass
     */
    public function getDisplayAttribute(): stdClass
    {
        $display = new stdClass();
        $display->title = $display->price = null;

        if ($this->id) {
            $display->title = $this->item?->display->title ?: null;
            $display->price = number_format($this->price ?? 0)
                . Functions::__(
                    array_key_exists($this->currency, self::CURRENCIES)
                        ? self::CURRENCIES[$this->currency]
                        : self::CURRENCIES_USD
                );
        }

        return $display;
    }

    /**
     * @return MorphTo
     */
    public function item(): MorphTo
    {
        return $this->morphTo('item')->withTrashed();
    }

    /**
     * @return BelongsTo
     */
    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class, 'shop_id');
    }

    public function credits()
    {
        return $this->morphMany(Credit::class, 'item');
    }

}
