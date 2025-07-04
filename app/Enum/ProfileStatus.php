<?php

namespace App\Enum;

enum ProfileStatus
{
    case ACTIVE;
    case SUSPENDED;
    case BANNED;
    case DEACTIVATED;

    public static function names()
    {
        return array_column(self::cases(), 'name');
    }
}
