<?php

namespace App\Console\Commands;

use App\Models\PresaleTransaction;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class CreateTransaction extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create-transaction';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Started new transaction');
        $amount = rand(500, 2500);
        $cryptoId = array_rand([6,13]);
        $transaction = new PresaleTransaction();
        $uuid = Str::uuid();
        $transaction->query()->create([
            'wallet_address' => substr($uuid, 0, 6),
            'amount' => $amount,
            'crypto_id' => $cryptoId,
            'usdt_amount' => $amount,
            'sbx_price' => $amount / 0.31,
            'transaction_confirmation' => 'Confirmed by platform [SYSTEM]',
            'txn_id' => $uuid,
        ]);
        $this->info('Created new transaction');
    }
}
