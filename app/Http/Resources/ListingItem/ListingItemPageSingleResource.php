<?php

namespace App\Http\Resources\ListingItem;

use App\Http\Resources\Comments\CommentsBlocksResource;
use App\Http\Resources\Favorites\FavoriteResource;
use App\Http\Resources\ListingItemCarSpecifications;
use App\Http\Resources\PhotoResource;
use App\Http\Resources\User\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class ListingItemPageSingleResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $photos = $this->photos->sortBy('id');

        $data = [
            'id'             => $this->id,
            'h'              => $this->item_hash,
            'title'          => $this->display->title,
            'price'          => $this->display->price,
            'description'    => $this->description,
            'specifications' => new ListingItemCarSpecifications($this->item),
            'user'           => new UserResource($this->user),
            'created_at'     => $this->created_at->diffForHumans(),
            'item'           => new ListingItemCarPageSingleResource($this->item),
            'favorites'      => FavoriteResource::collection($this->favorites),
            'photos'         => PhotoResource::collection($photos),
            'views'          => $this->views,
            'shop'           => $this->shop,
            'contacts'       => ContactResource::collection($this->contacts),
            'permalink'      => $this->links->permalink,
            'can'            => [
                'edit'      => Auth::check() ? Auth::user()->can('edit', $this->resource) : false,
                'edit_link' => Auth::check() ? $this->links->edit : null,
            ],
            'is_approved'    => (bool) $this->is_approved,
        ];

        if (config('site.comments.enabled') === true) {
            $data['comments'] = CommentsBlocksResource::collection($this->comments()->paginate(2));
        }

        return $data;
    }

}
