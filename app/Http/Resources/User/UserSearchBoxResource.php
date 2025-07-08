<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserSearchBoxResource extends JsonResource
{

    public function toArray(Request $request)
    {
        $this->resource->with(['profilePicture']);

        return [
            'id'              => $this->id,
            'first_name'      => $this->first_name,
            'last_name'       => $this->last_name,
            'name'            => $this->first_name.' '.$this->last_name,
            'email'           => $this->email,
            'profile_picture' => $this->profile_picture_path,
        ];
    }

}
