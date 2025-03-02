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
}
