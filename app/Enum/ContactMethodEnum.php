<?php

namespace App\Enum;

enum ContactMethodEnum: string
{

    case EMAIL = 'E-mail';
    case PHONE = 'Phone';
    case WHATSAPP = 'WhatsApp';
    case FACEBOOK = 'Facebook';
    case INSTAGRAM = 'Instagram';
    case TIKTOK = 'TikTok';
    case WEBSITE = 'Website';
    case OTHER = 'Other';

    public static function names()
    {
        return array_column(self::cases(), 'name');
    }

    public static function values()
    {
        return array_column(self::cases(), 'value');
    }

}
