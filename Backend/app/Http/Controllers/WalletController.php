<?php

namespace App\Http\Controllers;

use App\Exports\WalletsExport;
use App\Imports\WalletsImport;
use App\Models\Wallet;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class WalletController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $wallets = Wallet::all();
        return view('Wallet.walletFromAdmin', compact('wallets'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function getWallets()
    {
        $wallets = Wallet::all();

        return response()->json($wallets);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $wallet = new Wallet();
            $wallet->name = $request->name;
            $wallet->address = $request->address;

            if($request->hasFile('icon')) {
               $icon = Storage::disk('public')->put('wallets', $request->icon);
               $wallet->icon = $icon;
            }

            $wallet->save();
            return redirect()->route('walletAddress')->with('success', 'Wallet address added successfully');
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return redirect()->route('walletAddress')->with('error', 'Failed to add wallet address. Please try again.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $wallet = Wallet::findOrFail($id);
        $wallet->delete();

        return redirect()->route('walletAddress')->with('success', 'Wallet deleted successfully');
    }

    final public function import(Request $request): RedirectResponse
    {
        Excel::import(new WalletsImport(), $request->file('file'));

        return back()->with('success', 'Wallets Imported Successfully!');
    }

    final public function export(): BinaryFileResponse
    {
        return Excel::download(new WalletsExport(), 'wallets.xlsx');
    }
}
