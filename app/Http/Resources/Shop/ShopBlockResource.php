<?php

namespace App\Http\Resources\Shop;

use App\Http\Resources\Contacts\ContactResource;
use App\Http\Resources\Favorites\FavoriteResource;
use App\Http\Resources\User\UserObjectResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopBlockResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'h'              => $this->item_hash,
            'title'          => $this->title,
            'description'    => $this->description,
            'types'          => $this->types,
            'user'           => new UserObjectResource($this->user),
            'contacts'       => ContactResource::collection($this->contacts),
            'link'           => route('shop.single', $this->id),
            'created_at'     => $this->created_at->format('D, d M Y'),
            //'opening_days_display' => $opening_days_display,
            //'closing_days_display' => $closing_days_display,
            'location'       => $this->location,
            'cover_photo'    => $this->photos->where('is_cover', 1)->first(),
            'primary_photo'  => $this->photos->where('is_primary', 1)->first(),
            'favorites'      => FavoriteResource::collection($this->favorites),
            'listings_count' => $this->listingItems->count(),
        ];
    }

}
