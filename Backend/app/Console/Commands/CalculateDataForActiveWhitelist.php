<?php

namespace App\Console\Commands;

use App\Models\PresaleTransaction;
use App\Models\Whitelist;
use Illuminate\Console\Command;

class CalculateDataForActiveWhitelist extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:calculate-data-for-active-whitelist';

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
        $whitelist = Whitelist::query()->where('is_active', '=', 1)->first();

        if ($whitelist) {
            $presaleTransactions = PresaleTransaction::query()->select('account_wallet_address')->groupBy('account_wallet_address')->get();
            $transactionsCount = count($presaleTransactions->pluck('account_wallet_address')->toArray());

            $whitelist->usdtRaised = round(PresaleTransaction::query()->sum('usdt_amount'), 2);
            $whitelist->sbx_allocated = round(PresaleTransaction::query()->sum('sbx_price'), 0);

            $whitelist->holders = $transactionsCount;
            $whitelist->save();

        }
    }
}
