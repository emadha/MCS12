<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use stdClass;

/**
 *
 */
class Showroom extends Base
{
    use HasFactory;

    /**
     * @var string[]
     */
    protected $fillable = ['id', 'title', 'description', 'user_id' ];
    /**
     * @var string[]
     */
    protected $appends  = ['display', 'link' ];

    /**
     * @return string
     */
    public function getLinkAttribute(): string
    {
        return route('showroom.single', $this->id);
    }

    /**
     * @return \stdClass
     */
    public function getDisplayAttribute(): stdClass
    {
        $display             = new stdClass();
        $display->created_at = $this->created_at->diffForHumans();
        return $display;
    }
}
