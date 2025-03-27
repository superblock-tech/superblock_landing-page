<?php

namespace App\Http\Controllers;

use App\Models\Crypto;
use Illuminate\Http\Request;

class CryptoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cryptos = Crypto::all();
        return view('Crypto.cryptos', compact('cryptos'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function getPriceForCrypto()
    {
        $cryptos = Crypto::with('wallets')->get();
        return response()->json($cryptos);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function update($id)
    {
        $crypto = Crypto::find($id);
        $crypto->price = request('price');
        if($crypto->save()){
            return redirect()->route('cryptos')->with('success', 'Price updated successfully');
        } else {
            return redirect()->route('cryptos')->with('error', 'Price not updated');
        }
    }
}
