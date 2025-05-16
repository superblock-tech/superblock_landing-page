<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

class ContactFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'fullName' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required',
            'country' => 'required|string',
            'joinWhitelist' => 'required',
            'join_whitelist' => 'required'
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'Full name is required',
            'email.required' => 'Email is required',
            'email.email' => 'Email is invalid',
            'phone.required' => 'Phone is required',
            'country.required' => 'Country is required',
            'investment_interest.required' => 'Investment interest is required',
            'join_whitelist.required' => 'Join whitelist is required'
        ];
    }
}
