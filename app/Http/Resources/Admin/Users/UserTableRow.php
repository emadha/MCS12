<?php

namespace App\Http\Resources\Admin\Users;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property null|\Illuminate\Support\Carbon $created_at
 * @property null|\Illuminate\Support\Carbon $updated_at
 * @property null|\Illuminate\Support\Carbon $login_at
 * @property null|\Illuminate\Support\Carbon $activity_at
 */
class UserTableRow extends JsonResource
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
            'created_at_formatted'  => $this->created_at->diffForHumans(),
            'updated_at_formatted'  => $this->updated_at->diffForHumans(),
            'login_at_formatted'    => $this->login_at?->diffForHumans(),
            'activity_at_formatted' => $this->activity_at?->diffForHumans(),
        ];
    }

}
