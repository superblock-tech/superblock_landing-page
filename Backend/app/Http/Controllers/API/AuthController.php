<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\API\LoginRequest;
use App\Models\CodeForLogin;
use App\Models\Token;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class AuthController extends APIController
{
    final public function login(LoginRequest $request): JsonResponse
    {
        $code = CodeForLogin::query()->where('code', '=', $request->code)->first();
        $token = Str::random(60);
        Token::query()->create([
            'token' => $token,
            'code_for_login_id' => $code->id,
            'device' => $request->header('User-Agent'),
            'ip' => $request->ip(),
            'last_used_at' => now(),
        ]);

        return response()->json([
            'success' => 'Code is valid',
            'token' => $token
        ]);

    }
}
