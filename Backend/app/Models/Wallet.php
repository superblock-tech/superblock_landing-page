<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'address', 'icon', 'crypto_id'
    ];

    public function getIconAttribute()
    {
        if ($this->attributes['icon']) {
            return asset('storage/' . $this->attributes['icon']);
        }

        return null;
    }

    public function crypto()
    {
        return $this->belongsTo(Crypto::class);
    }
}
