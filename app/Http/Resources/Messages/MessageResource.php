<?php

namespace App\Http\Resources\Messages;

use App\Http\Resources\Favorites\FavoriteResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    public function __construct($resource)
    {
        parent::__construct($resource);
        //$this->resource->content = $resource->content;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'h'          => $this->item_hash,
            'favorites'  => FavoriteResource::collection($this->favorites),
            'user'       => [
                'id'              => $this->user->id,
                'name'            => $this->user->display->name,
                'profile_picture' => $this->user->profile_picture_path,
            ],
            'content'    => nl2br($this->content),
            'created_at' => $this->created_at->diffForHumans(),
        ];
    }
}
