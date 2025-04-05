<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Crypto extends Model
{
    use HasFactory;

    const FIAT = 'FIAT';

    protected $fillable = [
        'name',
        'price',
        'symbol',
    ];

    public function wallets()
    {
        return $this->hasMany(Wallet::class, 'crypto_id');
    }

    public function networks()
    {
        return $this->belongsToMany(CryptoNetwork::class, 'crypto_networks_to_cryptos', 'network_id', 'crypto_id');
    }
}
