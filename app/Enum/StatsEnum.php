<?php

namespace App\Enum;

enum StatsEnum
{

    case VIEW;

    public static function names()
    {
        return array_column(self::cases(), 'name');
    }

}
