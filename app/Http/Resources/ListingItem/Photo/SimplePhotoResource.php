<?php

namespace App\Http\Resources\ListingItem\Photo;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SimplePhotoResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'path'       => $this->path,
            'is_primary' => $this->is_primary,
        ];
    }

}
