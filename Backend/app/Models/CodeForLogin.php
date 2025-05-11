<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CodeForLogin extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'nameOfPerson', 'email', 'phone', 'default_wallet'];

    public function wallets(): HasMany
    {
        return $this->hasMany(CodeForLoginWallet::class, 'code_for_login_id', 'id');
    }
}
