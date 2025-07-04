<?php

namespace App\Http\Resources\ListingItem;

use App\Helpers\Functions;
use App\Http\Resources\Favorites\FavoriteResource;
use App\Http\Resources\ListingItemCar\ListingItemCarResource;
use App\Http\Resources\PredefinedLocation\PredefinedLocationResouce;
use App\Http\Resources\Shops\ShopResource;
use App\Http\Resources\User\UserObjectResource;
use App\Models\ListingItem;
use App\Models\ListingItemsCar;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;
use stdClass;

/**
 * @property int $id
 * @property Carbon $created_at
 * @property int $condition
 * @property BelongsTo $user
 * @property HasMany $favorites
 * @property Carbon sold_at
 * @property string $description
 * @property int $views
 * @property HasMany $photos
 * @property HasOne $item
 * @property string $item_type
 */
class ListingItemBlocksResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $withData = ['favorites', 'isFavorite'];

        if (config('site.ads.enabled')) {
            $withData[] = 'promotions';
        }

        $this->resource->with($withData);

        $display = [
            'id'              => $this->id,
            'h'               => $this->item_hash,
            'title'           => $this->item?->display->title,
            'description'     => $this->description,
            'created_at'      => $this->created_at?->diffForHumans() ?? $this->created_at,
            'created_at_long' => $this->created_at?->timezone(Auth::user()?->timezone ?? config('app.timezone')),
            'price'           => number_format($this->price)
                .' '
                .Functions::__(array_key_exists($this->currency,
                    ListingItem::CURRENCIES)
                    ? ListingItem::CURRENCIES[$this->currency]
                    : ListingItem::CURRENCIES[ListingItem::CURRENCIES_USD]
                ),
            'user'            => new UserObjectResource($this->user),
            //'user'          => new UserResource($this->user, false),
            'condition'       => $this->condition ? ListingItem::CONDITIONS[$this->condition] : null,
            'favorites'       => FavoriteResource::collection($this->favorites),
            'sold_at'         => $this->sold_at,
            'views'           => number_format($this->views),
            'primary_photo'   => ($this->photos?->where('is_primary', 1)->first()
                ?? $this->photos?->sortBy('id')->first())?->only(['path']),

            'photos_count' => $this->photos?->count(),
            'link'         => $this->item?->links->item,
            'shop_id'      => $this->shop_id,
            'location'     => new PredefinedLocationResouce(
                $this->shop_id && $this->shop && $this->shop->relationPredefinedLocation
                    ? $this->shop->relationPredefinedLocation
                    : $this->relationPredefinedLocation),
            'is_approved'  => $this->is_approved,
            'is_published' => $this->is_published,
        ];

        if (isset($this->links->permalink) && $this->links->permalink) {
            $display['permalink'] = $this->id && $this->links ? $this->links->permalink : null;
        }

        if (config('site.ads.enabled')) {
            $display['is_promoted'] = (bool) $this->promotions?->count();
        }

        $display['shop'] = new ShopResource($this->shop);

        if (get_class($this->item ?? new stdClass()) == ListingItemsCar::class) {
            $display['item'] = new ListingItemCarResource($this->item);
        }

        if (array_key_exists($this->item_type, ListingItem::DISPLAY_TYPES)) {
            $display ['type'] = ListingItem::DISPLAY_TYPES[$this->item_type];
        }

        return $display;
    }

}
