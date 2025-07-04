<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{

    protected $fillable = [
        'long', 'lat',
        'item_type', 'item_id',
        'address_object', 'address',
    ];

    use HasFactory;

    protected $casts = [
        'address_object' => 'array',
    ];

    public function item()
    {
        return $this->morphTo();
    }

}
