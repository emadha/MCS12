<?php

namespace App\Http\Resources\ListingItem;

use App\Http\Resources\FrontendCarDBResource;
use App\Http\Resources\User\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingItemCarPageSingleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'display' => $this->display,
            'car'     => new FrontendCarDBResource($this->car),
            'year'    => $this->year,
            'user'    => new UserResource($this->user),
        ];
    }
}
