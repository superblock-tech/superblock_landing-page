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
    ];



    protected $appends = ['tokens_allocated'];

    public function crypto()
    {
        return $this->belongsTo(Crypto::class);
    }

    public function cryptoNetwork()
    {
        return $this->belongsTo(CryptoNetwork::class);
    }

    public function getTokensAllocatedAttribute($value)
    {
        return $this->attributes['sbx_price'];
    }
}
