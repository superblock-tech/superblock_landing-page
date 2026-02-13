<?php

namespace App\Http\Controllers;

use App\Exports\PresaleTransactionsExport;
use App\Models\Crypto;
use App\Models\CryptoNetwork;
use App\Models\PresaleTransaction;
use App\Models\Wallet;
use Illuminate\Support\Facades\Artisan;
use Binance\Spot;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PresaleTransactionsController extends Controller
{
    public function index(Request $request)
    {
        $networkFilter = $request->get('network', 'all'); // 'all' or 'mainnet'
        $hideNoChain = filter_var($request->get('hide_no_chain', false), FILTER_VALIDATE_BOOLEAN);
        $cryptoFilter = $request->get('crypto_id');
        // Treat null, empty string, 'all' as "show all cryptos"
        if ($cryptoFilter === null || $cryptoFilter === '' || $cryptoFilter === 'all' || !ctype_digit((string) $cryptoFilter)) {
            $cryptoFilter = '';
        }
        $excludeTestnet = $networkFilter === 'mainnet';

        $blockchainQuery = PresaleTransaction::query()
            ->whereNotNull('txn_id')
            ->whereRaw("TRIM(txn_id) != ''")
            ->with(['cryptoNetwork', 'crypto']);
        $manualQuery = PresaleTransaction::query()
            ->where(function ($q) {
                $q->whereNull('txn_id')->orWhereRaw("TRIM(COALESCE(txn_id, '')) = ''");
            })
            ->with(['cryptoNetwork', 'crypto']);

        if ($cryptoFilter !== '') {
            $blockchainQuery->where('crypto_id', $cryptoFilter);
            $manualQuery->where('crypto_id', $cryptoFilter);
        }

        if ($excludeTestnet) {
            $blockchainQuery->excludeTestnet();
            $manualQuery->excludeTestnet();
        }

        if ($hideNoChain) {
            $blockchainQuery->whereNotNull('chain_name')->whereRaw("TRIM(COALESCE(chain_name, '')) != ''");
            $manualQuery->whereNotNull('chain_name')->whereRaw("TRIM(COALESCE(chain_name, '')) != ''");
        }

        $blockchainTransactions = $blockchainQuery->get();
        $manualTransactions = $manualQuery->get();

        // Collection filter as fallback (catches edge cases the DB scope might miss)
        if ($excludeTestnet) {
            $blockchainTransactions = $blockchainTransactions->filter(fn ($t) => !$t->isTestnet())->values();
            $manualTransactions = $manualTransactions->filter(fn ($t) => !$t->isTestnet())->values();
        }

        if ($hideNoChain) {
            $blockchainTransactions = $blockchainTransactions->filter(fn ($t) => trim((string) ($t->chain_name ?? '')) !== '')->values();
            $manualTransactions = $manualTransactions->filter(fn ($t) => trim((string) ($t->chain_name ?? '')) !== '')->values();
        }

        $filteredTransactions = $blockchainTransactions->concat($manualTransactions);
        $presaleTransactions = $filteredTransactions->unique('account_wallet_address');
        $transactionsCount = $presaleTransactions->count();
        $usdtAmount = $filteredTransactions->sum('usdt_amount');
        $sbxAmount = $filteredTransactions->sum('sbx_price');

        $cryptoNetwork = CryptoNetwork::all();
        $crypto = Crypto::query()->where('symbol', '=', Crypto::FIAT)->get();
        $cryptosForFilter = Crypto::query()
            ->where(function ($q) {
                $q->whereHas('wallets')
                    ->orWhere('symbol', '!=', Crypto::FIAT);
            })
            ->orderBy('name')
            ->get();

        $walletsForSelectedCrypto = collect();
        if ($cryptoFilter !== '') {
            $walletsForSelectedCrypto = Wallet::query()
                ->where('crypto_id', $cryptoFilter)
                ->with('crypto')
                ->get();
        }

        return view('PresaleTransaction.index', compact('blockchainTransactions', 'manualTransactions', 'crypto', 'cryptoNetwork', 'transactionsCount', 'usdtAmount', 'sbxAmount', 'networkFilter', 'hideNoChain', 'cryptoFilter', 'cryptosForFilter', 'walletsForSelectedCrypto'));
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $crypto = Crypto::query()->find($request->crypto_id);
            $cryptoNetwork = CryptoNetwork::query()->find($request->crypto_network_id);

            if ($crypto->symbol !== Crypto::FIAT && $cryptoNetwork) {
//                $binanceTransactionId = $this->withdrawBinance($request->wallet_address, $cryptoNetwork->address, $request->amount, $crypto->symbol);
//                if ($binanceTransactionId) {
//                    $request->request->set('txn_id', $binanceTransactionId);
//                    $request->request->set('transaction_confirmation', 'Confirmed via Binance');
//                }
            }

            $transaction = new PresaleTransaction();
            $transaction->query()->create($request->all());

            return redirect()->route('presale_transactions.list')->with('success', 'Transaction added successfully');
        } catch (Exception $e) {
            Log::info($e->getMessage());
            return redirect()->route('presale_transactions.list')->with('error', 'Failed to add Transaction. Please try again.');
        }
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

    final public function rescan(Request $request): RedirectResponse|JsonResponse
    {
        $cryptoId = $request->input('crypto_id');
        if (empty($cryptoId)) {
            return $this->rescanResponse($request, false, 'Please select a crypto/network from the dropdown before rescanning.');
        }

        $crypto = Crypto::find($cryptoId);
        if (!$crypto) {
            return $this->rescanResponse($request, false, 'Invalid crypto selected.');
        }

        $walletCount = Wallet::where('crypto_id', $cryptoId)->count();
        if ($walletCount === 0) {
            return $this->rescanResponse($request, false, "No receiving wallet configured for {$crypto->name}. Add a wallet at /wallet first.");
        }

        try {
            set_time_limit(300); // 5 min — rescan verifies each tx on chain (rate-limited)
            Artisan::call('app:get-ether-scan-transactions', ['--crypto_id' => $cryptoId, '--trace' => true]);
            $output = trim(Artisan::output());
            return $this->rescanResponse($request, true, "Rescan complete. Synced blockchain transactions for {$crypto->name}.", $output);
        } catch (\Throwable $e) {
            Log::error('Rescan failed: ' . $e->getMessage());
            return $this->rescanResponse($request, false, 'Rescan failed: ' . $e->getMessage());
        }
    }

    final public function deleteWithoutChainName(Request $request): RedirectResponse|JsonResponse
    {
        $count = PresaleTransaction::query()
            ->where(function ($q) {
                $q->whereNull('chain_name')
                    ->orWhereRaw("TRIM(COALESCE(chain_name, '')) = ''");
            })
            ->delete();

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json(['success' => true, 'message' => "Deleted {$count} transaction(s) without chain name."]);
        }
        return redirect()->back()->with('success', "Deleted {$count} transaction(s) without chain name.");
    }

    final public function checkEndpoints(Request $request): JsonResponse
    {
        $results = \App\Console\Commands\CheckBlockchainEndpoints::runChecks();
        $rows = [];
        foreach ($results as $label => $r) {
            $rows[] = ['endpoint' => $label, 'ok' => $r['ok'], 'message' => $r['message']];
        }
        $allOk = count(array_filter($results, fn ($r) => !$r['ok'])) === 0;
        return response()->json(['success' => $allOk, 'results' => $rows]);
    }

    private function rescanResponse(Request $request, bool $success, string $message, string $output = ''): RedirectResponse|JsonResponse
    {
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json(['success' => $success, 'message' => $message, 'output' => $output]);
        }
        return $success
            ? redirect()->back()->with('success', $message)
            : redirect()->back()->with('error', $message);
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
