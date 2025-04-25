<?php

namespace App\Console\Commands;

use App\Models\Wallet;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class GetEtherScanTransactions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:get-ether-scan-transactions';

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
        try {
            $wallet = Wallet::find(2);
//            foreach ($wallets as $wallet) {
                $this->info($wallet->address);
                $this->info(json_encode($this->handleTransactions($wallet)));
//            }
        }catch (\Throwable $exception){
            $this->warn($exception->getMessage());
        }

        return 0;
    }

    public function getBitcoinTransactions($walletAddress)
    {
        $response = Http::get("https://blockstream.info/api/address/{$walletAddress}/txs");

        if ($response->successful()) {
            $txs = $response->json();
            return $txs;
        }

        return ['error' => 'Could not fetch BTC transactions'];
    }

    public function getSolanaTransactions($walletAddress)
    {
        $rpcUrl = 'https://api.mainnet-beta.solana.com';

        $response = Http::post($rpcUrl, [
            'jsonrpc' => '2.0',
            'id' => 1,
            'method' => 'getSignaturesForAddress',
            'params' => [$walletAddress, ["limit" => 10]],
        ]);

        if ($response->successful()) {
            $signatures = collect($response->json()['result'])->pluck('signature');
            return $signatures;
        }

        return ['error' => 'Could not fetch SOL transactions'];
    }

    public function getXrpTransactions($walletAddress)
    {
        $rpcUrl = 'https://s2.ripple.com:51234';

        $response = Http::post($rpcUrl, [
            'method' => 'account_tx',
            'params' => [[
                'account' => $walletAddress,
                'ledger_index_min' => -1,
                'ledger_index_max' => -1,
                'limit' => 10,
            ]],
        ]);

        if ($response->successful()) {
            $txs = $response->json()['result']['transactions'] ?? [];
            return $txs;
        }

        return ['error' => 'Could not fetch XRP transactions'];
    }

    public function getTronTransactions($walletAddress)
    {
        $response = Http::get("https://api.trongrid.io/v1/accounts/{$walletAddress}/transactions");

        if ($response->successful()) {
            $txs = $response->json()['data'] ?? [];
            return $txs;
        }

        return ['error' => 'Could not fetch TRON transactions'];
    }

    public function getMainnetTransactions($walletAddress)
    {
        $apiUrls = [
            'mainnet' => 'https://api.etherscan.io/api',
            'sepolia' => 'https://api-sepolia.etherscan.io/api',
        ];

        $transactionData = [];

        foreach ($apiUrls as $apiUrl) {
            $response = Http::get($apiUrl, [
                'module' => 'account',
                'action' => 'txlist',
                'address' => $walletAddress,
                'startblock' => 0,
                'endblock' => 99999999,
                'sort' => 'desc',
                'apikey' => 'MZBJRUHJNCKKABRK7VMJVMP8RU6R3F7XTP',
            ]);

            if (!is_array($response->json()['result'])) {
                dd($response->json()['result']);
            }
            foreach ($response->json()['result'] as $tx) {
                $transactionData[] = [
                    'hash' => $tx['hash'],
                    'blockNumber' => hexdec($tx['blockNumber']),
                    'from' => $tx['from'],
                    'to' => $tx['to'],
                    'transactionIndex' => hexdec($tx['transactionIndex']),
                    'saved_value' => $tx['value'],
                    'formatted_value' => $tx['value'],
                    'status' => $tx['txreceipt_status'] === "1" ? 'Success' : 'Failed',
                ];

//                $this->warn('hash: ' . $tx['hash']);
//                $this->info('blockNumber: ' . $tx['blockNumber']);
//                $this->info('from: ' . $tx['from']);
//                $this->info('to: ' . $tx['to']);
//                $this->info('transactionIndex: ' . (int)$tx['transactionIndex']);
//                $this->info('saved value: ' . $tx['value']);
//                $this->info('value: ' . '0.000' . $tx['value']);
//                $this->info('txreceipt_status: ' . ($tx['txreceipt_status'] === "1" ? 'Success' : 'Failed'));
            }
        }
        return $transactionData;
    }

    public function handleTransactions($wallet)
    {
                if ($wallet->crypto?->symbol === 'BTC') {
                    return $this->getBitcoinTransactions($wallet->address);
                } else if ($wallet->crypto?->symbol === 'SOL') {
                    return $this->getSolanaTransactions($wallet->address);
                } else if ($wallet->crypto?->symbol === 'XRP') {
                    return $this->getXrpTransactions($wallet->address);
                } else if ($wallet->crypto?->symbol === 'TRC') {
                    return $this->getTronTransactions($wallet->address);
                } else {
                    return $this->getMainnetTransactions($wallet->address);
                }

    }
}
