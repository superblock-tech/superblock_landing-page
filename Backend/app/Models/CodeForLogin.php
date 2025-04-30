<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CodeForLogin extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'nameOfPerson', 'email', 'phone', 'default_wallet'];
}
