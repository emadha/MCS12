<?php

namespace App\Rules;

use App\Models\Shop;
use App\Models\ShopType;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Translation\PotentiallyTranslatedString;

class ShowroomAuthorized implements ValidationRule
{

    /**
     * Run the validation rule.
     *
     * @param  Closure(string): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $Showroom = Shop::where([
            'id'      => $value,
            'user_id' => Auth::id(),
        ])->type([ShopType::TYPE_SHOWROOM])
            ->exists();

        if (!$Showroom) {
            $fail('Invalid Showroom');
        }
    }

}
