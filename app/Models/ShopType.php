<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopType extends Model
{

    use HasFactory;

    protected $fillable = ['title', 'type'];

    public static array $shopTypes = [
        1  => 'Showroom',
        2  => 'Rental',
        3  => 'Mechanic',
        4  => 'Parts',
        5  => 'General Service',
        6  => 'Paint',
        7  => 'Detailing',
        8  => 'Tuning',
        9  => 'Accessories',
        10 => 'Car Wash',
    ];

    const TYPE_SHOWROOM = 1;

    const TYPE_RENTAL = 2;

    const TYPE_MECHANIC = 3;

    const TYPE_PARTS = 4;

    const TYPE_GENERAL_SERVICE = 5;

    const TYPE_PAINT = 6;

    const TYPE_DETAILING = 7;

    const TYPE_TUNING = 8;

    const TYPE_ACCESSORIES = 9;

    public function shop()
    {
        return $this->hasManyThrough(
            Shop::class,
            ShopShopType::class,
            null,
            'id',
            'id', 
            'shop_id'
        );
    }

}
