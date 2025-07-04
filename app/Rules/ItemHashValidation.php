<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Crypt;

class ItemHashValidation implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        try {
            $decryptedHash = Crypt::decryptString($value);
            $decryptedHashParts = explode(':', $decryptedHash);

            if (count($decryptedHashParts) !== 2) {
                $fail('Something went wrong #'.__LINE__);
            }

            if (!class_exists($decryptedHashParts[0])) {
                $fail('Something went wrong #'.__LINE__);
            }

            if (!class_exists($decryptedHashParts[0])) {
                $fail('Something went wrong #'.__LINE__);
            }

            if (!$decryptedHashParts[0]::find($decryptedHashParts[1])) {
                $fail('Something went wrong #'.__LINE__);
            }
        } catch (\Exception $exception) {
            $fail('Something went wrong #'.__LINE__);
        }
    }
}
