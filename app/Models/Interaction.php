<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Auth;

class Interaction extends Model
{
    use HasFactory;

    protected $fillable = [ 'user_id', 'type' ];

    public function item(): MorphTo
    {
        return $this->morphTo();
    }

    public function scopeMine( Builder $query )
    {
        $query->where('user_id', Auth::id());
    }
}
