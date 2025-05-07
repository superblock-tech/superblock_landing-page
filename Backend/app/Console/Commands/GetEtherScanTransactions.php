<?php

namespace App\Console\Commands;

use App\Models\Crypto;
use App\Models\PresaleTransaction;
use App\Models\Wallet;
use App\Models\Whitelist;
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
            $wallets = Wallet::all();
            foreach ($wallets as $wallet) {
                $this->info($wallet->address);
                $this->info(json_encode($this->handleTransactions($wallet)));
            }
        }catch (\Throwable $exception){
            $this->warn($exception->getMessage());
        }

        return 0;
    }

    public function getBitcoinTransactions($wallet)
    {
        $walletAddress = $wallet->address;
        $crypto = Crypto::query()->find($wallet->crypto_id);
        $sbxWhitelist = Whitelist::query()->where('is_active', '=', 1)->first();
        $response = Http::get("https://blockstream.info/api/address/{$walletAddress}/txs");
        $result  = [];

        if ($response->successful()) {
            $txs = $response->json();

            foreach ($txs as $tx) {
                if (isset($tx['status']['confirmed']) && $tx['status']['confirmed'] === true) {
                    $txid = $tx['txid'];

                    $inputAddresses = array_filter(array_map(function ($vin) {
                        return $vin['prevout']['scriptpubkey_address'] ?? null;
                    }, $tx['vin']));

                    $outputs = $tx['vout'];

                    $isSender = in_array($walletAddress, $inputAddresses);
                    $isRecipient = false;
                    $amountSatoshi = 0;

                    foreach ($outputs as $vout) {
                        $address = $vout['scriptpubkey_address'] ?? null;
                        $value = $vout['value'] ?? 0;

                        if (!$address) {
                            continue;
                        }

                        if (!$isSender && $address === $walletAddress) {
                            $isRecipient = true;
                            $amountSatoshi += $value;
                        }
                    }

                    if ($isRecipient) {

                        $transaction = PresaleTransaction::query()->firstOrCreate([
                            'txn_id' => $txid
                        ],
                            [
                            'account_wallet_address' => $inputAddresses[0] ?? 'unknown',
                            'wallet_address' => $inputAddresses[0] ?? 'unknown',
                            'amount' => $amountSatoshi / 1e8,
                            'crypto_id' => $crypto->id,
                            'usdt_amount' => $amountSatoshi / 1e8 * $crypto->price,
                            'sbx_price' => $amountSatoshi / 1e8 * $crypto->price / $sbxWhitelist->sbxPrice,
                            'transaction_confirmation' => 'Confirmed via chain status tracking',
                            'txn_id' => $txid,
                            'crypto_network_id' => 6,
                            'system_wallet_id' => $wallet->id,
                            'system_wallet' => $walletAddress
                        ]);
                        $this->info('Recognized transaction: ' . $transaction->id);
                    }
                }
            }

            return $result;
        }


        return ['error' => 'Could not fetch BTC transactions'];
    }

    public function getSolanaTransactions($wallet)
    {
        $walletAddress = $wallet->address;
        $crypto = Crypto::query()->find($wallet->crypto_id);
        $sbxWhitelist = Whitelist::query()->where('is_active', '=', 1)->first();
        $result  = [];
        $rpcUrl = 'https://api.mainnet-beta.solana.com';

        $response = Http::post($rpcUrl, [
            'jsonrpc' => '2.0',
            'id' => 1,
            'method' => 'getSignaturesForAddress',
            'params' => [$walletAddress, ['limit' => 10]],
        ]);

        if ($response->successful() && isset($response['result'])) {
            foreach ($response['result'] as $txMeta) {
                $signature = $txMeta['signature'];

                $txResponse = Http::post($rpcUrl, [
                    'jsonrpc' => '2.0',
                    'id' => 1,
                    'method' => 'getTransaction',
                    'params' => [$signature, 'jsonParsed'],
                ]);

                $txData = $txResponse['result'] ?? null;

                if (!$txData) continue;

                $instructions = $txData['transaction']['message']['instructions'] ?? [];

                foreach ($instructions as $ix) {
                    if (
                        isset($ix['program'], $ix['parsed']['type']) &&
                        $ix['program'] === 'system' &&
                        $ix['parsed']['type'] === 'transfer'
                    ) {
                        $info = $ix['parsed']['info'];
                        $from = $info['source'];
                        $to = $info['destination'];
                        $lamports = $info['lamports'];
                        $amount = $lamports / 1000000000;

                        if ($to === $walletAddress) {
                            $transaction = PresaleTransaction::query()->firstOrCreate([
                                'txn_id' => $signature
                            ],
                                [
                                    'account_wallet_address' => $from ?? 'unknown',
                                    'wallet_address' => $from ?? 'unknown',
                                    'amount' => $amount,
                                    'crypto_id' => $crypto->id,
                                    'usdt_amount' => $amount * $crypto->price,
                                    'sbx_price' => $amount * $crypto->price / $sbxWhitelist->sbxPrice,
                                    'transaction_confirmation' => 'Confirmed via chain status tracking',
                                    'txn_id' => $signature,
                                    'crypto_network_id' => 7,
                                    'system_wallet_id' => $wallet->id,
                                    'system_wallet' => $walletAddress
                                ]);
                            $this->info('Recognized transaction: ' . $transaction->id);
                        }
                    }
                }
            }

            return $result;
        }

        return ['error' => 'Could not fetch SOL transactions'];
    }

    public function getXrpTransactions($wallet)
    {
        $walletAddress = $wallet->address;
        $crypto = Crypto::query()->find($wallet->crypto_id);
        $sbxWhitelist = Whitelist::query()->where('is_active', '=', 1)->first();
        $result = [];
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
            foreach ($txs as $data) {
                $info = $data['tx'];
                $amount = $info['Amount'] / 1e6;
                $from = $info['Account'];
                $to = $info['Destination'];

                if ($to === $walletAddress) {
                    $transaction = PresaleTransaction::query()->firstOrCreate([
                        'txn_id' => $info['hash']
                    ],
                        [
                            'account_wallet_address' => $from ?? 'unknown',
                            'wallet_address' => $from ?? 'unknown',
                            'amount' => $amount,
                            'crypto_id' => $crypto->id,
                            'usdt_amount' => $amount * $crypto->price,
                            'sbx_price' => $amount * $crypto->price / $sbxWhitelist->sbxPrice,
                            'transaction_confirmation' => 'Confirmed via chain status tracking',
                            'txn_id' => $info['hash'],
                            'crypto_network_id' => 8,
                            'system_wallet_id' => $wallet->id,
                            'system_wallet' => $walletAddress
                        ]);
                    $this->info('Recognized transaction: ' . $transaction->id);
                }
            }
            return $result;
        }

        return ['error' => 'Could not fetch XRP transactions'];
    }

    public function getTronTransactions($wallet)
    {
        $walletAddress = $wallet->address;
        $crypto = Crypto::query()->find($wallet->crypto_id);
        $sbxWhitelist = Whitelist::query()->where('is_active', '=', 1)->first();
        $response = Http::get("https://api.trongrid.io/v1/accounts/{$walletAddress}/transactions");

        if ($response->successful()) {
            $txs = $response->json()['data'] ?? [];
            foreach ($txs as $tx) {
                if (isset($tx['ret'][0]['contractRet']) && $tx['ret'][0]['contractRet'] === 'SUCCESS') {
                    $info = $tx['raw_data']['contract'][0]['parameter']['value'];
                    $amount = $info['amount'] / 1e6;
                    $from = $this->hexToBase58($info['owner_address']);
                    $to = $this->hexToBase58($info['to_address']);

                    if ($to === $walletAddress) {
                        $transaction = PresaleTransaction::query()->firstOrCreate([
                            'txn_id' => $tx['txID']
                        ],
                            [
                                'account_wallet_address' => $from ?? 'unknown',
                                'wallet_address' => $from ?? 'unknown',
                                'amount' => $amount,
                                'crypto_id' => $crypto->id,
                                'usdt_amount' => $amount * $crypto->price,
                                'sbx_price' => $amount * $crypto->price / $sbxWhitelist->sbxPrice,
                                'transaction_confirmation' => 'Confirmed via chain status tracking',
                                'txn_id' => $tx['txID'],
                                'crypto_network_id' => 5,
                                'system_wallet_id' => $wallet->id,
                                'system_wallet' => $walletAddress
                            ]);
                        $this->info('Recognized transaction: ' . $transaction->id);
                    }
                }
            }
            return $txs;
        }

        return ['error' => 'Could not fetch TRON transactions'];
    }

    public function getMainnetTransactions($wallet)
    {
        $walletAddress = $wallet->address;
        $crypto = Crypto::query()->find($wallet->crypto_id);
        $sbxWhitelist = Whitelist::query()->where('is_active', '=', 1)->first();
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

                if ($tx['txreceipt_status'] === "1") {
                    $transaction = PresaleTransaction::query()->firstOrCreate([
                        'txn_id' => $tx['hash']
                    ],
                        [
                            'account_wallet_address' => $tx['from'] ?? 'unknown',
                            'wallet_address' => $tx['from'] ?? 'unknown',
                            'amount' => $tx['value'] / 1e18,
                            'crypto_id' => $crypto->id,
                            'usdt_amount' => $tx['value'] / 1e18 * $crypto->price,
                            'sbx_price' => $tx['value'] / 1e18 * $crypto->price / $sbxWhitelist->sbxPrice,
                            'transaction_confirmation' => 'Confirmed via chain status tracking',
                            'txn_id' => $tx['hash'],
                            'crypto_network_id' => 1,
                            'system_wallet_id' => $wallet->id,
                            'system_wallet' => $tx['to']
                        ]);
                    $this->info('Recognized transaction: ' . $transaction->id);
                }


            }
        }
        return $transactionData;
    }

    public function handleTransactions($wallet)
    {
                if ($wallet->crypto?->symbol === 'BTC') {
                    return $this->getBitcoinTransactions($wallet);
                } else if ($wallet->crypto?->symbol === 'SOL') {
                    return $this->getSolanaTransactions($wallet);
                } else if ($wallet->crypto?->symbol === 'XRP') {
                    return $this->getXrpTransactions($wallet);
                } else if ($wallet->crypto?->symbol === 'TRX') {
                    return $this->getTronTransactions($wallet);
                } else {
                    return $this->getMainnetTransactions($wallet);
                }

    }

    private function hexToBase58($hex)
    {
        $addressBin = hex2bin($hex);
        $hash0 = hash('sha256', $addressBin, true);
        $hash1 = hash('sha256', $hash0, true);
        $checksum = substr($hash1, 0, 4);
        $addressWithChecksum = $addressBin . $checksum;

        $alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        $base58 = '';
        $intVal = gmp_init(bin2hex($addressWithChecksum), 16);

        while (gmp_cmp($intVal, 0) > 0) {
            list($intVal, $rem) = gmp_div_qr($intVal, 58);
            $base58 = $alphabet[gmp_intval($rem)] . $base58;
        }

        foreach (str_split($addressWithChecksum) as $char) {
            if ($char === "\x00") {
                $base58 = '1' . $base58;
            } else {
                break;
            }
        }

        return $base58;
    }
}
