<?php

namespace App\Http\Resources\User;

use App\Http\Resources\Shops\ShopResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


class UserObjectResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id'              => $this->id,
            'name'            => $this->first_name.' '.$this->last_name,
            'email'           => $this->email,
            'profile_picture' => $this->profile_picture_path,
            'link'            => route('user.single', $this->id),
        ];
    }
}
