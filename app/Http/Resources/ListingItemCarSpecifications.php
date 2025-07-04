<?php

namespace App\Http\Resources;

use App\Models\ListingItem;
use App\Models\ListingItemsCar;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingItemCarSpecifications extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'Exterior Color'    => ListingItemsCar::EXTERIOR_COLORS[$this->exterior_color ?? 0],
            'Interior Color'    => ListingItemsCar::INTERIOR_COLORS[$this->interior_color ?? 0],
            'Interior Material' => ListingItemsCar::INTERIOR_MATERIAL[$this->interior_material ?? 0],
            'Body Type'         => $this->car->body_type ?? 'Unspecified',
            'Condition'         => ListingItem::CONDITIONS[$this->listingItem->condition ?? 0],
            'Odometer'          => number_format($this->odometer).'km',
            'Transmission'      => $this->car->transmission,
        ];
    }

}
