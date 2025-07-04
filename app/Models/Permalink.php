<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permalink extends Model
{
    use HasFactory;
    protected $fillable = ['url'];

    public function item()
    {
        return $this->morphTo();
    }

    public function getRouteKeyName()
    {
        return 'url';
    }
}
