<?php

namespace App\Http\Resources\Favorites;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class FavoriteResource extends JsonResource
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
        ];
    }

    public static function collection($resource)
    {
        return [
            'status'         => 1,
            'favoritesCount' => $resource->count(),
            'inFavorites'    => (bool)$resource->where('user_id', Auth::id())->count(),
        ];
    }
}
