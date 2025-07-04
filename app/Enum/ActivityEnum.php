<?php

namespace App\Enum;

enum ActivityEnum
{

    case UNDEFINED;

    case CREATED;
    case UPDATED;
    case DELETED;
    case RETRIEVED;
    case VIEW;
    case RESTORED;

    public static function names()
    {
        return array_column(self::cases(), 'name');
    }

}
