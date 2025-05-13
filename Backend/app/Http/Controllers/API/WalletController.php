<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\API\WalletUpdateRequest;
use App\Models\CodeForLogin;
use App\Models\CodeForLoginWallet;
use Illuminate\Http\Response;

class WalletController extends APIController
{
    final public function update(WalletUpdateRequest $request): Response
    {
        $investorCode = $this->getInvestorCode();

        if ($investorCode) {
            if ($request->is_primary === true && !$investorCode->default_wallet) {
                $investorCode->default_wallet = $request->wallet;
                $investorCode->save();
            }

            $isFirstOne = CodeForLoginWallet::query()
                ->where('crypto_id', '=', $request->crypto_id)
                ->where('crypto_network_id', '=', $request->crypto_network_id)
                ->where('code_for_login_id', '=', $investorCode->id)
                ->exists();

            if (!$isFirstOne) {
                $request->request->set('is_primary', true);
            }

            if ($isFirstOne && $request->is_primary === true) {
                CodeForLoginWallet::query()
                    ->where('crypto_id', '=', $request->crypto_id)
                    ->where('crypto_network_id', '=', $request->crypto_network_id)
                    ->where('code_for_login_id', '=', $investorCode->id)
                    ->update(['is_primary' => false]);
            }

            $request->request->set('code_for_login_id', $investorCode->id);
            CodeForLoginWallet::query()->create($request->request->all());
            return response(null, 201);
        }

        return response(null, 422);
    }

    final public function getPrimaryWallet(int $cryptoId, int $cryptoNetworkId): string|null
    {
        $investorCode = $this->getInvestorCode();
        $primaryWallet = null;

        if ($investorCode) {
             $codeForLoginWallet = CodeForLoginWallet::query()
                ->where('crypto_id', '=', $cryptoId)
                ->where('crypto_network_id', '=', $cryptoNetworkId)
                ->where('code_for_login_id', '=', $investorCode->id)
                ->where('is_primary', true)->first();
            $primaryWallet = $codeForLoginWallet->wallet ?? $investorCode->default_wallet;
        }

        return $primaryWallet;
    }

    final public function getPrimaryWalletByTransactionWallet(string $transactionWallet): string|null
    {
        $codeForLoginWallet = CodeForLoginWallet::query()->where('wallet', '=', $transactionWallet)->first();
        if ($codeForLoginWallet) {
            if ($codeForLoginWallet->is_primary === true) {
                return $codeForLoginWallet->wallet;
            }

            $codeForLoginPrimaryWallet = CodeForLoginWallet::query()
                ->where('code_for_login_id', '=', $codeForLoginWallet->code_for_login_id)
                ->where('is_primary', '=', true)
                ->first();

            if ($codeForLoginPrimaryWallet) {
                return $codeForLoginPrimaryWallet->wallet;
            }

            $codeForLogin = CodeForLogin::query()->find($codeForLoginWallet->code_for_login_id);
            if ($codeForLogin) {
                return $codeForLogin->default_wallet;
            }

        }
        return null;
    }
}
