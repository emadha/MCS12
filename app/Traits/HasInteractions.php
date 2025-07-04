<?php

namespace App\Traits;


use App\Enum\ReactionEnum;
use App\Models\Interaction;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Auth;


trait HasInteractions
{
    public function interaction(): MorphMany
    {
        return $this->morphMany(Interaction::class, 'item');
    }

    public function myInteractions()
    {
        return $this->interaction()->mine();
    }

    public function countMyInteractions()
    {
        return $this->myInteractions()->count();
    }


    public function interact( ReactionEnum $interactionsEnum, bool $toggle = true )
    {
        if ( $this->countMyInteractions() ) {
            $this->myInteractions()->delete();
        } else {
            $this->myInteractions()->create([
                'user_id' => Auth::id(),
                'type'    => $interactionsEnum->name
            ]);
        }

        return $this->interaction;
    }

}
