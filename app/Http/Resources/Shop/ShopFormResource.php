<?php

namespace App\Http\Resources\Shop;

use App\Http\Resources\Contacts\ContactResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopFormResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...parent::toArray($request),
            'username'      => $this->username?->username,
            'primary_photo' => $this->primary_photo?->path,
            'types'         => $this->types->pluck('id'),
            'contacts'      => ContactResource::collection($this->contacts),
            'opening_hour'  => $this->opening_hour,
            'closing_hour'  => $this->closing_hour,
            'opening_days'  => $this->opening_days,
            'established_at' => $this->established_at?->format('Y-m-d'),
        ];
    }

}
