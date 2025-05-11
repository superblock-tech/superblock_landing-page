<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

class WalletUpdateRequest extends FormRequest
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
            'wallet' => 'required|string|unique:code_for_login_wallets,wallet',
            'crypto_id' => 'required|integer|exists:cryptos,id',
            'crypto_network_id' => 'required|integer|exists:crypto_networks,id',
        ];
    }

    public function messages(): array
    {
        return [
          'wallet.required' => 'Wallet is required',
          'wallet.string' => 'Wallet must be a string',
          'wallet.unique' => 'Wallet already exists',
          'crypto_id.required' => 'Crypto is required',
          'crypto_id.exists' => 'Crypto does not exist',
          'crypto_network_id.required' => 'Crypto network is required',
          'crypto_network_id.exists' => 'Crypto network does not exist',
        ];
    }
}
