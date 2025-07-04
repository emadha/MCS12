<?php

namespace App\Http\Resources\ListingItem;

use App\Http\Resources\FrontendCarDBResource;
use App\Models\ListingItemsCar;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FrontendListingItemCarResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'display'        => $this->display,
            'interior_color' => ListingItemsCar::INTERIOR_COLORS[$this->interior_color],
            'odometer'       => $this->odometer,
            'car'            => new FrontendCarDBResource($this->car),
        ];
    }

}
