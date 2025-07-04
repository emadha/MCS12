<?php

namespace App\Models;

use App\Traits\HasUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use stdClass;

class Comment extends Base
{
    use HasFactory,
        HasUser;

    protected $fillable = [ 'user_id', 'body', 'comment_id' ];

    public function getDisplayAttribute(): stdClass
    {
        $display             = new stdClass();
        $display->created_at = $this->created_at->diffForHumans();
        return $display;
    }

    public function parent()
    {
        return $this->hasMany(Comment::class);
    }

    public function item(): MorphTo
    {
        return $this->morphTo();
    }


}
