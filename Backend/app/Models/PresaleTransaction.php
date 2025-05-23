<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PresaleTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'wallet_address',
        'amount',
        'crypto_id',
        'usdt_amount',
        'sbx_price',
        'transaction_confirmation',
        'txn_id',
        'crypto_network_id',
        'system_wallet',
        'system_wallet_id',
        'account_wallet_address',
        'chain_id',
        'chain_name'
    ];


    public function crypto()
    {
        return $this->belongsTo(Crypto::class);
    }

    public function cryptoNetwork()
    {
        return $this->belongsTo(CryptoNetwork::class);
    }

    public function systemWalletObject()
    {
        return $this->hasOne(Wallet::class, 'id', 'system_wallet_id');
    }
}
