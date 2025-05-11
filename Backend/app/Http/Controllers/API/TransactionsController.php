<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\API\TransactionStoreRequest;
use App\Models\CodeForLoginWallet;
use App\Models\PresaleTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class TransactionsController extends APIController
{
    final public function index(): JsonResponse
    {
        $transactions = [];
        $code = $this->getInvestorCode();

        if ($code) {
            $wallets = CodeForLoginWallet::query()->where('code_for_login_id', '=', $code->id)->get();
            $transactionsQuery = PresaleTransaction::query();

            if ($wallets) {
                $transactionsQuery->whereIn('account_wallet_address', $wallets->pluck('address')->toArray());
            }

            if ($code->default_wallet) {
                $transactionsQuery->orWhere('account_wallet_address', $code->default_wallet);
            }

            $transactions = $transactionsQuery->with(['crypto', 'cryptoNetwork'])
                ->orderByDesc('id')
                ->get();
        }


        return response()->json($transactions);
    }

    final public function store(TransactionStoreRequest $request): Response
    {
        $request->request->set('transaction_confirmation', 'Confirmed via External Application');
        $request->request->set('account_wallet_address',(new WalletController())->getPrimaryWallet($request->crypto_id, $request->crypto_network_id));

        $transaction = new PresaleTransaction();
        $transaction->query()->create($request->all());

        return response(null, 201);
    }
}
