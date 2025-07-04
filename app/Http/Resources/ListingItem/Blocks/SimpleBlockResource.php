<?php

namespace App\Http\Resources\ListingItem\Blocks;

use App\Http\Resources\ListingItem\Photo\SimplePhotoResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SimpleBlockResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'title'  => $this->display->title,
            'photos' => SimplePhotoResource::collection($this->photos),
            'link'   => $this->links->item,
        ];
    }

}
