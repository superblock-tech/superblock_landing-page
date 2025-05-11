<?php

namespace App\Http\Controllers\API;

use App\Models\CodeForLogin;
use App\Models\Token;
use Illuminate\Database\Eloquent\Model;

class APIController
{
    final public function getInvestorCode(): Model|null
    {
        $token = Token::query()->where('token', \request()?->bearerToken())->first();
        if ($token) {
            return CodeForLogin::query()->where('id', $token->code_for_login_id)->first();
        }

        return null;
    }
}
