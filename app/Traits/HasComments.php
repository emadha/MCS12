<?php

namespace App\Traits;

use App\Models\Comment;
use Illuminate\Support\Facades\Auth;

trait HasComments
{

    public function comments()
    {
        return $this->morphMany(Comment::class, 'item');
    }

    public function comment( string $body )
    {
        return $this->comments()->create([
            'user_id' => Auth::id(),
            'body'    => $body
        ]);
    }
}