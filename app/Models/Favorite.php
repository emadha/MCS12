<?php

namespace App\Models;

use App\Traits\HasActivity;
use App\Traits\HasUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Favorite extends Base
{

    use HasActivity, HasFactory, HasUser;

    protected $fillable = ['user_id', 'item_id', 'item_type'];

    public function item(): MorphTo
    {
        return $this->morphTo();
    }

}
