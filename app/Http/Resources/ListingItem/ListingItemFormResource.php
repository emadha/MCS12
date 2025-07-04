<?php

namespace App\Http\Resources\ListingItem;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingItemFormResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            ...parent::toArray($request),
        ];
    }
}