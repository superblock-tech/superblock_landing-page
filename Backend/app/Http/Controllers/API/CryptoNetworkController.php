<?php

namespace App\Http\Controllers\API;

use App\Models\CryptoNetwork;
use Illuminate\Http\JsonResponse;

class CryptoNetworkController extends APIController
{
    final public function index(): JsonResponse
    {
        $cryptos = CryptoNetwork::query()
            ->with(['cryptos', 'cryptos.wallets.crypto'])
            ->get();

        return response()->json($cryptos);
    }
}
