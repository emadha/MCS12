<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Username extends Model
{
    use HasFactory;

    protected $fillable = [
        'username',
        'item_id',
        'item_type',
    ];

    public function item()
    {
        return $this->morphTo();
    }
}
