<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPref extends Model
{

    use HasFactory;

    protected $primaryKey = ['pref', 'user_id'];

    public $incrementing = false;

    public function user()
    {
        return $this->belongsTo();
    }

}
