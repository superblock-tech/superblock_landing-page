<?php

namespace App\Imports;

use App\Models\ContactForm;
use App\Models\Crypto;
use App\Models\PresaleTransaction;
use Maatwebsite\Excel\Concerns\ToModel;

class PresaleTransactionsImport implements ToModel
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        $crypto = Crypto::query()->where('name', '=', $row[2])->first();
        return new ContactForm([
            'wallet_address' => $row[0],
            'amount' => $row[1],
            'crypto_id' => $crypto?->id,
            'usdt_amount' => $row[3],
            'sbx_price' => $row[4],
            'transaction_confirmation' => $row[5],
            'txn_id' => $row[6]
        ]);
    }
}
