<?php

namespace App\Http\Controllers;

use App\Models\PresaleTransaction;
use App\Models\Whitelist;
use Carbon\Carbon;
use Illuminate\Http\Request;

class WhitelistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $whiteListContent = Whitelist::first();

        return view('Crypto.whitelistContent', compact('whiteListContent'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update($id, Request $request)
    {
        $whiteListContent = Whitelist::find($id);


        if($whiteListContent->update($request->all())){
            return redirect()->route('whitelist')->with('success', 'Whitelist updated successfully');
        }else{
            return redirect()->route('whitelist')->with('error', 'Whitelist not updated');
        }
    }

    public function getWhitelistContent()
    {
        $whiteListContent = Whitelist::query()->where('is_active', '=', 1)->first();
        $transactionsCount = count(PresaleTransaction::query()->select('wallet_address')->groupBy('wallet_address')->get()->pluck('wallet_address')->toArray());

        return response()->json(
            [
                'usdtRaised' => $whiteListContent->usdtRaised,
                'sbxPrice' => $whiteListContent->sbxPrice,
                'name' => $whiteListContent->name,
                'nameNext' => $whiteListContent->name_next,
                'sbxPriceNext' => $whiteListContent->sbx_price_next,
                'totalTokens' => $whiteListContent->sbx_tokens,
                'holders' => $transactionsCount,
                'sbxAllocated' => $whiteListContent->sbx_allocated,
                'sbxTotal' => $whiteListContent->totalTokens,
                'startedAt' => Carbon::parse($whiteListContent->started_at)->format('U'),
                'finishedAt' => Carbon::parse($whiteListContent->finished_at)->format('U'),
            ]
        );
    }
}
