<?php

namespace App\Exports;

use App\Models\PresaleTransaction;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PresaleTransactionsExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $transactions = PresaleTransaction::with('crypto')->get();
        $result = [];
        foreach ($transactions as $transaction) {
            $result[] = [
                'id' => $transaction->id,
                'wallet_address' => $transaction->wallet_address,
                'amount' => $transaction->amount,
                'crypto' => $transaction->crypto?->name,
                'usdt_amount' => $transaction->usdt_amount,
                'sbx_price' => $transaction->sbx_price,
                'tokens_allocated' => $transaction->tokens_allocated,
                'transaction_confirmation' => $transaction->transaction_confirmation,
                'txn_id' => $transaction->txn_id,
                'created_at' => $transaction->created_at,
            ];
        }

        return collect($result);
    }

    public function headings(): array
    {
        return ["id", "wallet address", "amount", "crypto", "usdt amount", "sbx price", "tokens allocated", "transaction confirmation", "txn id", 'date'];
    }
}
