<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Token;

class CheckToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token || !Token::where('token', $token)->exists()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}

