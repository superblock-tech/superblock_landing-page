<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CryptoNetwork extends Model
{
    use HasFactory, SoftDeletes;

    public function cryptos()
    {
        return $this->belongsToMany(Crypto::class, 'crypto_networks_to_cryptos', 'network_id', 'crypto_id');
    }
}
