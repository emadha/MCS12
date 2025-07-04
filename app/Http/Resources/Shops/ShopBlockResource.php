<?php

namespace App\Http\Resources\Shops;

use App\Http\Resources\Favorites\FavoriteResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopBlockResource extends JsonResource
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

        return [
            ...parent::toArray($request),

            'photos'        => $this->photos,
            //'opening_days_display' => $opening_days_display,
            //'closing_days_display' => $closing_days_display,
            'cover_photo'   => $this->cover_photo,
            'primary_photo' => $this->primary_photo ?? $this->photos->first(),
            'favorites'     => FavoriteResource::collection($this->favorites),
        ];
    }
}