<?php

namespace App\Http\Controllers;

use App\Exports\PresaleTransactionsExport;
use App\Models\Crypto;
use App\Models\CryptoNetwork;
use App\Models\PresaleTransaction;
use Binance\Spot;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PresaleTransactionsController extends Controller
{
    public function index()
    {
        $transactions = PresaleTransaction::all();
        $crypto = Crypto::all();
        $cryptoNetwork = CryptoNetwork::all();
        $transactionsCount = count($transactions);

        $usdtAmount = 0;
        $sbxAmount = 0;

        foreach ($transactions as $transaction) {
            $usdtAmount += $transaction->usdt_amount;
            $sbxAmount += $transaction->tokens_allocated;
        }

        return view('PresaleTransaction.index', compact('transactions', 'crypto', 'cryptoNetwork', 'transactionsCount', 'usdtAmount', 'sbxAmount'));
    }

    public function findByAddress(string $address) {
        $transactions = PresaleTransaction::query()
            ->where('wallet_address', $address)->with(['crypto', 'cryptoNetwork'])
            ->orderByDesc('id')
            ->get();

        return response()->json($transactions);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $crypto = Crypto::query()->find($request->crypto_id);
            $cryptoNetwork = CryptoNetwork::query()->find($request->crypto_network_id);

            if ($crypto->name !== Crypto::FIAT && $cryptoNetwork) {
                $binanceTransactionId = $this->withdrawBinance($request->wallet_address, $cryptoNetwork->address, $request->amount, $crypto->symbol);
                if ($binanceTransactionId) {
                    $request->request->set('txn_id', $binanceTransactionId);
                    $request->request->set('transaction_confirmation', 'Confirmed via Binance');
                }
            }

            $transaction = new PresaleTransaction();
            $transaction->query()->create($request->all());

            return redirect()->route('presale_transactions.list')->with('success', 'Transaction added successfully');
        } catch (Exception $e) {
            Log::info($e->getMessage());
            return redirect()->route('presale_transactions.list')->with('error', 'Failed to add Transaction. Please try again.');
        }
    }

    public function storeLocalTransaction(Request $request)
    {
        $request->request->set('transaction_confirmation', 'Local transaction. Chain ID: ' . $request->chain_id . ' Chain name: ' . $request->chain_name);

        Log::debug($request->all());
        $transaction = new PresaleTransaction();
        $transaction->query()->create($request->all());

        return response(null, 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $transaction = PresaleTransaction::query()->findOrFail($id);
        $transaction->delete();

        return redirect()->route('presale_transactions.list')->with('success', 'Transaction deleted successfully');
    }

    final public function import(Request $request): RedirectResponse
    {
        Excel::import(new TransactionsImport(), $request->file('file'));

        return back()->with('success', 'Transactions Imported Successfully!');
    }

    final public function export(): BinaryFileResponse
    {
        return Excel::download(new PresaleTransactionsExport(), 'transactions.xlsx');
    }

    final public function confirm(Request $request, int $id): RedirectResponse
    {
        try {
            $transaction = PresaleTransaction::query()->findOrFail($id);
            $transaction->update([
                'transaction_confirmation' => $request->transaction_confirmation,
                'txn_id' => $request->txn_id,
            ]);
            return redirect()->route('presale_transactions.list')->with('success', 'Transaction confirmed successfully');
        } catch (Exception $e) {
            Log::info($e->getMessage());
            return redirect()->route('presale_transactions.list')->with('error', 'Transaction confirmation errors');
        }



    }

    private function withdrawBinance($address, $network, $amount, $currency)
    {
        $client = new Spot([
            'key' => env('BINANCE_MERCHANT_API_KEY'),
            'secret' => env('BINANCE_MERCHANT_SECRET_KEY')
        ]);

        $response = $client->withdraw(
            $currency,
            $address,
            $amount,
            [
                'network' => $network
            ]
        );

        return $response['id'];
    }

}
