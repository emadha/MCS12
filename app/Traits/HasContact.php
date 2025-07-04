<?php

namespace App\Traits;

use App\Models\Contact;

trait HasContact
{
    public function contacts()
    {
        return $this->morphMany(Contact::class, 'item');
    }
}