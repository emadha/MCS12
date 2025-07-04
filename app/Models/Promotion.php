<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{

    use HasFactory;

    protected $fillable = ['user_id', 'item_type', 'item_id', 'expires_at', 'is_active'];

    public function item()
    {
        return $this->morphTo();
    }

}
