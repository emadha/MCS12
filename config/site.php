<?php

use App\Models\ListingItem;

return [

    'site.notifications.slack.listing.created',

    'activities' => [
        'log' => [
            'enabled'  => true,
            'listings' => true,
        ],
    ],

    'notifications' => [
        'slack' => [
            'permalink.created' => false,
            'listing.created'   => false,
            'shop.created'      => false,
            'balance.deducted'  => false,
        ],
    ],

    'messages'   => [
        'unsend' => [
            'enabled'          => true,
            'max_allowed_time' => 40, //seconds
        ],
    ],
    'users'      => [
        'welcome_credits' => 1000,
    ],
    'ads'        => [
        'enabled' => false,
    ],
    'comments'   => [
        'enabled' => false,
    ],
    'filter'     => [
        'makes'  => [
            'max' => 2,
        ],
        'models' => [
            'max' => 5,
        ],
    ],
    'currencies' => [

        'list' => [
            ...ListingItem::CURRENCIES,
        ],

        'default' => ListingItem::CURRENCIES_USD,
    ],
    'locales'    => [
        'list'    => [
            'ar' => 'عربي',
            'fr' => 'Français',
            'en' => 'English',
            'sv' => 'Svenska',
        ],
        'default' => 'en',
    ],
    'listing'    => [
        'photos' => [
            'min' => 3,
            'max' => [
                'free' => 12,
            ],
        ],
    ],
    'shops'      => [
        'username' => [
            'max_length' => 30,
        ],
    ],
    'photos'     => [
        'delete_invalid_photos' => true,
        'recreate'              => true,
    ],
    'regions'    => [
        'list'    => [
            // 'ae' => 'United Arab Emirates',
            // 'lb' => 'Lebanon',
            // 'au' => 'Australia',
            // 'sa' => 'Saudi Arabia',
        ],
        'default' => env('DEFAULT_REGION', 'lb'),
    ],
];
