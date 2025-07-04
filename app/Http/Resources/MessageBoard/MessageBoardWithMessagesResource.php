<?php

namespace App\Http\Resources\MessageBoard;

use App\Http\Resources\Messages\MessageResource;
use App\Http\Resources\User\UserObjectResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;


class MessageBoardWithMessagesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $perPage = 10;

        /** @var \App\Models\MessageBoard $this */
        $messageBoardMessages = $this->resource->messages()->with([
            'user.profilePicture',
            'favorites',
        ])->orderByDesc('created_at');

        $messageBoardMessagesPaginated = $messageBoardMessages->paginate($perPage);

        // Weird, it's not returned anywhere, yet it can update the resource object
        MessageResource::collection($messageBoardMessagesPaginated);

        $participants = $this->participants();
        $participantsResource = UserObjectResource::collection($participants->get()->pluck('user'));

        $participantsCount = $participants->get()->unique()->count();

        $last_page = $messageBoardMessagesPaginated->url($messageBoardMessagesPaginated->lastPage());

        return [
            'uuid'               => $this->uuid,
            'h'                  => $this->item_hash,
            'link'               => route('messages.board.single', $this->uuid),
            'last_message'       => Str::limit($this->last_message),
            'last_sender'        => new UserObjectResource($this->sender),
            'updated_at'         => $this->updated_at->diffForHumans(),
            'participants'       => $participantsResource,
            'participants_count' => $participantsCount,
            'messages'           => $messageBoardMessagesPaginated,
        ];
    }
}
