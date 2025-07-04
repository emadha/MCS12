<?php

namespace App\Http\Resources\MessageBoard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;


class MessageBoardBriefResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'link'         => route('messages.board.single', $this->uuid),
            'h'            => $this->item_hash,
            'last_message' => Str::limit($this->last_message),
            'last_sender'  => [
                'name'            => $this->sender?->display->name,
                'profile_picture' => $this->sender?->profile_picture_path,
            ],
            'updated_at'   => $this->updated_at->diffForHumans(),
        ];
    }
}
