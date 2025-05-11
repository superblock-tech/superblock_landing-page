<?php

namespace App\Http\Requests\API;

use Illuminate\Foundation\Http\FormRequest;

class TransactionStoreRequest extends FormRequest
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
            'chain_id' => 'required',
            'chain_name' => 'required',
            'txn_id' => 'required',
            'sbx_price' => 'required',
            'amount' => 'required',
            'crypto_id' => 'required',
            'crypto_network_id' => 'required',
            'wallet_address' => 'required'
        ];
    }
}
