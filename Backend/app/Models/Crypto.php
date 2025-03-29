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
}
