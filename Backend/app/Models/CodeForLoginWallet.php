<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CodeForLoginWallet extends Model
{
    use HasFactory;

    protected $fillable = ['code_for_login_id', 'wallet', 'crypto_id', 'crypto_network_id', 'is_primary'];
}
