<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Rules\OrphanPhotoRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'first_name'    => ['string', 'max:255'],
            'last_name'     => ['string', 'max:255'],
            // 'email'         => ['email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'profile_photo' => ['nullable'],
        ];
    }
}
