<?php

namespace App\Http\Resources\ListingItemCar;

use App\Models\ListingItemsCar;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingItemCarResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'exterior_color'    => ListingItemsCar::EXTERIOR_COLORS[$this->exterior_color ?? 0],
            'interior_color'    => ListingItemsCar::INTERIOR_COLORS[$this->interior_color ?? 0],
            'interior_material' => ListingItemsCar::INTERIOR_MATERIAL[$this->interior_material ?? 0],
            'car'               => $this->car,
            'odometer'          => $this->odometer,
        ];
    }
}
