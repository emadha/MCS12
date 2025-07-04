<?php

namespace App\Http\Resources\Shops;

use App\Enum\ActivityEnum;
use App\Http\Resources\Contacts\ContactResource;
use App\Http\Resources\Favorites\FavoriteResource;
use App\Http\Resources\User\UserObjectResource;
use App\Models\Car;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class ShopResource extends JsonResource
{

    public function toArray(Request $request)
    {
        $days = [
            1 => 'Sunday',
            2 => 'Monday',
            3 => 'Tuesday',
            4 => 'Wednesday',
            5 => 'Thursday',
            6 => 'Friday',
            7 => 'Saturday',
        ];

        $opening_days_display = $this->opening_days ?: [];
        $closing_days_display = $this->closing_days ?: [];

        foreach ($opening_days_display as $_key => $_opening_day) {
            $opening_days_display[$_key] = $days[$_opening_day];
        }

        unset($_opening_day);

        foreach ($closing_days_display as $_key => $_closing_day) {
            $closing_days_display[$_key] = date('l', $_closing_day);
        }
        unset($_closing_day);

        $photos = $this->photos;


        return [
            ...parent::toArray($request),
            'h'             => $this->item_hash,
            'user'          => new UserObjectResource($this->user),
            'photos'        => $photos,
            'contacts'      => ContactResource::collection($this->contacts),
            'link'          => route('shop.single', $this->id),
            'created_at'    => $this->created_at->format('D, d M Y'),
            //'opening_days_display' => $opening_days_display,
            //'closing_days_display' => $closing_days_display,
            'location'      => $this->location,
            'cover_photo'   => $photos->where('is_cover')->first(),
            'primary_photo' => $photos->where('is_primary')->first(),
            'favorites'     => FavoriteResource::collection($this->favorites),
        ];
    }

}
