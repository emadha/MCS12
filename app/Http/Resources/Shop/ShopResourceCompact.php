<?php

namespace App\Http\Resources\Shop;

use App\Http\Resources\ShopType\ShopTypeResourceCompact;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopResourceCompact extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'    => $this->id,
            'title' => $this->title,
        ];
    }

}
