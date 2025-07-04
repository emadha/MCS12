<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    use HasFactory;

    protected $fillable = ['url', 'item_id', 'item_type'];

    public function item()
    {
        return $this->morphTo();
    }
}
