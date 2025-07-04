<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stats extends Model
{

    use HasFactory;

    protected $fillable = ['uuid', 'user_id', 'type', 'note'];

    public function item()
    {
        return $this->morphTo();
    }

}
