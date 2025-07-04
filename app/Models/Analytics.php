<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Analytics extends Model
{
    use HasFactory;

    public array $deviceTypes = [
        0 => 'desktop',
        1 => 'mobile',
        2 => 'tablet',
    ];

    const DEVICE_DESKTOP = 0;
    const DEVICE_MOBILE  = 1;
    const DEVICE_TABLE   = 2;

    public function item()
    {
        return $this->morphTo();
    }
}
