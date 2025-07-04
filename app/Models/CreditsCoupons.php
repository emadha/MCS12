<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CreditsCoupons extends Model
{
    use HasFactory;

    protected $fillable
        = [
            'code',
            'amount',
            'redeemed_by',
            'note',
            'is_paid',
        ];
}
