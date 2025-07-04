<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 *
 */
class Report extends Base
{
    use HasFactory;

    /**
     * @var string[]
     */
    protected $fillable = ['email', 'item_type', 'item_id', 'message', 'answered'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function item(): \Illuminate\Database\Eloquent\Relations\MorphTo
    {
        return $this->morphTo();
    }
}
