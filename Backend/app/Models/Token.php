<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    use HasFactory;

    protected $fillable = ['token', 'code_for_login_id', 'device', 'last_used_at', 'ip'];

    public function codeForLogin()
    {
        return $this->hasOne(CodeForLogin::class,'id', 'code_for_login_id');
    }
}
