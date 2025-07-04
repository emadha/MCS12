<?php

namespace App\Http\Resources\Comments;

use App\Http\Resources\User\UserObjectResource;
use App\Http\Resources\User\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentsBlocksResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'body'       => $this->body,
            'user'       => new UserResource($this->user),
            'created_at' => $this->created_at->diffForHumans(),
        ];
    }
}
