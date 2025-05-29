<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\WhitelistResource;
use App\Models\PresaleTransaction;
use App\Models\Whitelist;
use Carbon\Carbon;
use Illuminate\Http\Request;

class WhitelistController extends APIController
{
    final public function index(): WhitelistResource
    {
        $whiteListContent = Whitelist::query()->where('is_active', '=', 1)->first();
        $presaleTransactions = PresaleTransaction::query()->select('account_wallet_address')->groupBy('account_wallet_address')->get();
        $transactionsCount = count($presaleTransactions->pluck('account_wallet_address')->toArray()) ?? 0;

        return new WhitelistResource($whiteListContent, $transactionsCount);
    }
}
