<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{

    use HasFactory;

    public $fillable = ['method', 'value'];


    public function item()
    {
        return $this->morphTo();
    }

}
