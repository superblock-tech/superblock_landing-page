<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'icon',
        'cryptos_id',
    ];

    public function crypto()
    {
        return $this->belongsTo(Crypto::class, 'cryptos_id');
    }
}
