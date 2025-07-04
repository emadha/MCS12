<?php

namespace App\Rules;

use App\Models\Photo;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class OrphanPhotoRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!$value) {
            return;
        }

        $Photo = Photo::where([
            'id'        => decrypt($value),
            'item_type' => null,
            'item_id'   => null,
        ])->first();

        if (!$Photo) {
            $fail('Photo Error');
        }
    }
}
