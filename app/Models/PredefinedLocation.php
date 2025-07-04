<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PredefinedLocation extends Base
{
    use HasFactory;

    protected $fillable = ['region', 'name'];
}
