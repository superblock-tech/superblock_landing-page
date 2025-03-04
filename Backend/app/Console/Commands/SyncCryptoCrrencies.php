<?php

namespace App\Console\Commands;

use App\Models\Crypto;
use GuzzleHttp\Client;
use Illuminate\Console\Command;

class SyncCryptoCrrencies extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync-crypto-currencies';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get actual data of cryptocurrencies';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $crypto = Crypto::all();
        foreach ($crypto as $item) {
            $client = new Client();
            $data = $client->get('https://api.coinbase.com/v2/exchange-rates?currency=' . $item->symbol);
            $content = json_decode($data->getBody()->getContents(), true);
            if (isset($content['data']['rates']['USD'])) {
                $item->price = round($content['data']['rates']['USD'], 2);
                $item->save();
                $this->info('Synced ' . $item->symbol . ' Currency...');
            }
        }
    }
}
