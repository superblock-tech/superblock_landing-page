<?php

namespace App\Http\Controllers;

use App\Models\PresaleTransaction;
use App\Models\Whitelist;
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
        $whiteListContent = Whitelist::first(['usdtRaised', 'sbxPrice', 'totalTokens', 'holders']);

        $transactions = PresaleTransaction::all();

        $usdtAmount = 0;
        $sbxAmount = 0;

        foreach ($transactions as $transaction) {
            $usdtAmount += $transaction->usdt_amount;
            $sbxAmount += $transaction->tokens_allocated;
        }

        $usdtRaised = $usdtAmount;
        $sbxPrice = $whiteListContent->sbxPrice;
        $totalTokens = $sbxAmount;
        $totalBuyTokens = ($usdtRaised / $sbxPrice);
        $percentage = $totalTokens === 0 ? 0 : (($totalBuyTokens / $totalTokens ) * 100);

        $whiteListContent->percentage = $percentage;

        return response()->json(
            [
                'usdtRaised' => $usdtAmount,
                'sbxPrice' => 0.001,
                'totalTokens' => $sbxAmount,
                'holders' => count($transactions),
                'percentage' => $transactions === 0 ? 0 : ($sbxAmount / count($transactions) * 100),
            ]
        );
    }
}
