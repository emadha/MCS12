<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{

    public function toArray(Request $request)
    {
        return [
            'id'                   => $this->id,
            'google_id'            => $this->google_id,
            'meta_id'              => $this->meta_id,
            'ms_id'                => $this->ms_id,
            'first_name'           => $this->first_name,
            'last_name'            => $this->last_name,
            'name'                 => $this->first_name.' '.$this->last_name,
            'email'                => $this->email,
            'profile_picture'      => $this->profile_picture_path,
            'created_at'           => $this->created_at,
            'created_at_formatted' => $this->created_at->diffForHumans(),
            'email_verified_at'    => $this->email_verified_at,
            'link'                 => route('user.single', $this->id),
        ];
    }

}
