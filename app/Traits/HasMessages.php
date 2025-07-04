<?php

namespace App\Traits;

use App\Models\Message;

trait HasMessages
{
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}