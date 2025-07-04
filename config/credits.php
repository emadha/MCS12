<?php

return [
    'enabled' => env('CREDITS_ENABLED', false),
    'prices'  => [
        'Welcome Bonus'               => 1000,
        'carfax'                      => 700,
        'post_car'                    => 300,
        'refund_within_0_30_minutes'  => 100, // percentage of price
        'refund_within_30_60_minutes' => 40, // percentage of price
        'edit_post'                   => 100,
        'create_shop'                 => 500,
        'add_car_to_shop'             => 150,
        'send_message'                => 1,
    ],
];
