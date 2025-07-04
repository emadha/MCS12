<?php

namespace App\Rules;

use App\Helpers\Functions;
use App\Models\Shop;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class ShopUsernameRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!preg_match("/^[[:alnum:]\._]+$/", $value)) {
            $fail(Functions::__('Username may only contain letters and numbers and a dot.'));
        }

        if (Shop::where('username', $value)->exists()) {
            $fail(Functions::__('Username already exists'));
        }
    }
}
