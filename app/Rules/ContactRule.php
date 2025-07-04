<?php

namespace App\Rules;

use App\Enum\ContactMethodEnum;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Validator;

/**
 * Contacts Validation Rule
 * Must be of syntax array [ { method: ContactTypeEnum , value: string} ]
 */
class ContactRule implements ValidationRule
{

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Convert contacts into Collection
        $contacts = collect($value);

        $failedContacts = [];

        $filteredCount = $contacts->filter(function ($contact) use ($attribute, $fail, &$failedContacts) {
            $contact = (object) $contact;

            // Not isset contact->value
            if (!isset($contact->value)) {
                return false;
            };

            // Contact Value is null
            if (!$contact->value) {
                return false;
            }

            // Validate cases
            switch ($contact->method) {
                case ContactMethodEnum::EMAIL->name:
                {
                    $emailValidator = Validator::make((array) $contact, ['value' => 'email'], [
                        'value.email' => "One of the contact is set to type of email, but its value is not an e-mail.",
                    ]);
                    if ($emailValidator->fails()) {
                        $failedContacts[] = $emailValidator->getMessageBag()->messages()['value'][0];
                    }

                    break;
                }

                case ContactMethodEnum::PHONE->name:
                {
                    // Validate phone number based on country later, leave for now
                    break;
                }

                case ContactMethodEnum::WHATSAPP->name:
                {
                    // Validate whatsapp number based on country later, leave for now
                    break;
                }

                case ContactMethodEnum::FACEBOOK->name:
                {
                    if (!filter_var($contact->value, FILTER_VALIDATE_URL)) {
                        $fail('Contact of type Facebook must be a url');
                    }

                    $urlRegex = "/(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/i";

                    preg_match($urlRegex, $contact->value, $matches);

                    if (!count($matches)) {
                        $fail("One of your contacts is set to Facebook, but its value is not a facebook url.");
                    }

                    break;
                }

                case ContactMethodEnum::INSTAGRAM->name:
                {
                    if (!filter_var($contact->value, FILTER_VALIDATE_URL)) {
                        $fail('Contact of type Instagram must be a url');
                    }

                    $urlRegex = "/(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.]{1,30}\/?/";

                    preg_match($urlRegex, $contact->value, $matches);

                    if (!count($matches)) {
                        $fail("One of your contacts is set to Instagram, but its value is not an Instagram url.");
                    }

                    break;
                }

                case ContactMethodEnum::WEBSITE->name:
                {
                    if (!filter_var($contact->value, FILTER_VALIDATE_URL)) {
                        $fail('Contact of type Website must be a url');
                    }
                }

                case ContactMethodEnum::OTHER->name:
                {
                    break;
                }

                default:
            }
        });

        if ($failedContacts) {
            $fail('Contacts failed: ', implode("\n", $failedContacts));
        }

        // todo not tested
        if (!$filteredCount) {
            $fail('Contact is empty');
        }
    }

}
