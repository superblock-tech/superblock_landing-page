<?php

namespace App\Console\Commands;

use App\Http\Controllers\API\WalletController;
use App\Models\Crypto;
use App\Models\PresaleTransaction;
use App\Models\Wallet;
use App\Models\Whitelist;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GetEtherScanTransactions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:get-ether-scan-transactions {--crypto_id= : Only sync wallets for this crypto ID} {--trace : Log each request and response}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch blockchain transactions for presale wallets and sync to database';

    private bool $verbose = false;

    /**
     * Execute the console command.
     */
    public function handle()
    {
        set_time_limit(300); // 5 min — verification + sync can be slow (rate-limited APIs)
        $this->verbose = $this->option('trace');
        $this->logVerbose('=== Rescan START ===');
        try {
            $cryptoId = $this->option('crypto_id');
            $query = Wallet::query()->with('crypto');

            if ($cryptoId !== null && $cryptoId !== '') {
                $query->where('crypto_id', $cryptoId);
            }

            $wallets = $query->get()->groupBy('address');
            $this->logVerbose("Wallets to sync: " . $wallets->count());
            if ($cryptoId) {
                $this->logVerbose('Phase 1: Reconcile existing txns');
                $this->reconcileAllTransactionsForCrypto((int) $cryptoId);
            }
            $this->logVerbose('Phase 2: Sync from chain');
            foreach ($wallets as $walletGroup) {
                $wallet = $walletGroup->first();
                if (!$wallet->crypto) {
                    $this->warn("Skipping wallet {$wallet->address}: no crypto assigned");
                    continue;
                }
                $this->info($wallet->address . ' (' . $wallet->crypto->symbol . ')');
                $this->handleTransactions($wallet);
            }
        } catch (\Throwable $exception) {
            $this->warn($exception->getMessage());
            $this->logVerbose('EXCEPTION: ' . $exception->getMessage());
        }
        $this->logVerbose('=== Rescan END ===');
        return 0;
    }

    /**
     * For each blockchain transaction: verify TX hash exists on chain.
     * If not found, clear txn_id → becomes manual (no TX hash = manual).
     */
    private function reconcileAllTransactionsForCrypto(int $cryptoId): void
    {
        $crypto = Crypto::find($cryptoId);
        if (!$crypto) {
            return;
        }

        $txns = PresaleTransaction::query()
            ->where('crypto_id', $cryptoId)
            ->whereNotNull('txn_id')
            ->where('txn_id', '!=', '')
            ->with('crypto')
            ->get();

        $this->logVerbose("Reconciling " . $txns->count() . " tx(s) for crypto_id={$cryptoId} ({$crypto->symbol})");

        foreach ($txns as $i => $tx) {
            $this->logVerbose("Verify tx #" . ($i + 1) . "/" . $txns->count() . " id={$tx->id} txn_id=" . substr($tx->txn_id ?? '', 0, 18) . '...');
            usleep(150000);
            if (!$this->verifyTxExistsOnChain($tx)) {
                $oldTxnId = $tx->txn_id;
                $tx->update([
                    'txn_id' => null,
                    'transaction_confirmation' => ($tx->transaction_confirmation ? $tx->transaction_confirmation . ' | ' : '') .
                        'Moved to manual: TX hash not found on chain',
                ]);
                $this->info("Moved to manual: PresaleTransaction id {$tx->id} (txn_id not on chain: " . substr($oldTxnId, 0, 16) . '...)');
            }
        }
        $this->deduplicateByTxnId($cryptoId);
    }

    private function deduplicateByTxnId(int $cryptoId): void
    {
        $duplicates = PresaleTransaction::query()
            ->where('crypto_id', $cryptoId)
            ->whereNotNull('txn_id')
            ->whereRaw("TRIM(txn_id) != ''")
            ->get()
            ->groupBy('txn_id')
            ->filter(fn ($g) => $g->count() > 1);

        foreach ($duplicates as $txnId => $group) {
            $keep = $group->sortBy('id')->first();
            foreach ($group->where('id', '!=', $keep->id) as $extra) {
                $extra->update([
                    'txn_id' => null,
                    'transaction_confirmation' => ($extra->transaction_confirmation ? $extra->transaction_confirmation . ' | ' : '') .
                        'Moved to manual: duplicate TX hash',
                ]);
                $this->info("Moved duplicate to manual: txn_id " . substr($txnId, 0, 16) . '...');
            }
        }
    }

    /**
     * Verify a transaction's txn_id exists on the blockchain. Returns true if found.
     */
    private function verifyTxExistsOnChain(PresaleTransaction $tx): bool
    {
        $txnId = trim($tx->txn_id ?? '');
        if ($txnId === '') {
            return false;
        }

        $symbol = $tx->crypto?->symbol ?? '';
        return match (strtoupper($symbol)) {
            'BTC' => $this->verifyBitcoinTxExists($txnId),
            'ETH', 'USDT', 'USDC' => $this->verifyEthereumTxExists($txnId),
            'MATIC' => $this->verifyPolygonTxExists($txnId),
            'SOL' => $this->verifySolanaTxExists($txnId),
            'TRX' => $this->verifyTronTxExists($txnId),
            'XRP' => $this->verifyXrpTxExists($txnId),
            default => $this->verifyEthereumTxExists($txnId) || $this->verifyPolygonTxExists($txnId) || $this->verifyBitcoinTxExists($txnId),
        };
    }

    private function logVerbose(string $msg): void
    {
        if ($this->verbose) {
            $this->line('[VERBOSE] ' . $msg);
        }
    }

    private function verifyBitcoinTxExists(string $txnId): bool
    {
        $url = "https://blockstream.info/api/tx/" . substr($txnId, 0, 16) . '...';
        $this->logVerbose("GET {$url}");
        $response = Http::timeout(30)->get("https://blockstream.info/api/tx/{$txnId}");
        $this->logVerbose("  -> HTTP {$response->status()}, ok=" . ($response->successful() ? 'yes' : 'no'));
        return $response->successful();
    }

    private function verifyEthereumTxExists(string $txnId): bool
    {
        $url = 'https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=' . substr($txnId, 0, 18) . '...';
        $this->logVerbose("GET {$url}");
        $response = Http::timeout(30)->get('https://api.etherscan.io/api', [
            'module' => 'proxy', 'action' => 'eth_getTransactionByHash',
            'txhash' => $txnId, 'apikey' => env('ETHERSCAN_API_TOKEN'),
        ]);
        $result = $response->json()['result'] ?? null;
        $found = $result !== null && $result !== false;
        $this->logVerbose("  -> HTTP {$response->status()}, result=" . ($found ? 'tx' : (is_null($result) ? 'null' : 'false')));
        return $found;
    }

    private function verifyPolygonTxExists(string $txnId): bool
    {
        $this->logVerbose('GET https://api.polygonscan.com/api (txhash=' . substr($txnId, 0, 18) . '...)');
        $response = Http::timeout(30)->get('https://api.polygonscan.com/api', [
            'module' => 'proxy', 'action' => 'eth_getTransactionByHash',
            'txhash' => $txnId, 'apikey' => env('POLYSCAN_API_TOKEN'),
        ]);
        $result = $response->json()['result'] ?? null;
        $found = $result !== null && $result !== false;
        $this->logVerbose("  -> HTTP {$response->status()}, result=" . ($found ? 'tx' : (is_null($result) ? 'null' : 'false')));
        return $found;
    }

    private function verifySolanaTxExists(string $txnId): bool
    {
        $this->logVerbose('POST https://api.mainnet-beta.solana.com getTransaction ' . substr($txnId, 0, 16) . '...');
        $response = Http::timeout(30)->post('https://api.mainnet-beta.solana.com', [
            'jsonrpc' => '2.0', 'id' => 1, 'method' => 'getTransaction',
            'params' => [$txnId, 'jsonParsed'],
        ]);
        $result = $response->json()['result'] ?? null;
        $found = $result !== null;
        $this->logVerbose("  -> HTTP {$response->status()}, result=" . ($found ? 'tx' : 'null'));
        return $found;
    }

    private function verifyTronTxExists(string $txnId): bool
    {
        $url = "https://api.trongrid.io/v1/transactions/" . substr($txnId, 0, 16) . '...';
        $this->logVerbose("GET {$url}");
        $response = Http::timeout(30)->get("https://api.trongrid.io/v1/transactions/{$txnId}");
        $data = $response->json()['data'] ?? [];
        $found = !empty($data);
        $this->logVerbose("  -> HTTP {$response->status()}, data=" . (empty($data) ? 'empty' : 'ok'));
        return $found;
    }

    private function verifyXrpTxExists(string $txnId): bool
    {
        $this->logVerbose('POST https://s2.ripple.com:51234 method=tx ' . substr($txnId, 0, 16) . '...');
        $response = Http::timeout(30)->post('https://s2.ripple.com:51234', [
            'method' => 'tx', 'params' => [['transaction' => $txnId]],
        ]);
        $result = $response->json()['result'] ?? [];
        $found = ($result['validated'] ?? false) === true || isset($result['hash']);
        $this->logVerbose("  -> HTTP {$response->status()}, validated=" . ($result['validated'] ?? '?'));
        return $found;
    }

    private function getOnChainTransactionIds(Wallet $wallet): array
    {
        $symbol = $wallet->crypto?->symbol ?? '';
        return match ($symbol) {
            'BTC' => $this->getBitcoinOnChainTxnIds($wallet->address),
            'SOL' => $this->getSolanaOnChainTxnIds($wallet->address),
            'XRP' => $this->getXrpOnChainTxnIds($wallet->address),
            'TRX' => $this->getTronOnChainTxnIds($wallet->address),
            default => $this->getEthereumOnChainTxnIds($wallet),
        };
    }

    private function getBitcoinOnChainTxnIds(string $walletAddress): array
    {
        $txnIds = [];
        $lastSeen = null;
        $txs = [];
        do {
            $url = $lastSeen
                ? "https://blockstream.info/api/address/{$walletAddress}/txs/chain/{$lastSeen}"
                : "https://blockstream.info/api/address/{$walletAddress}/txs";
            $response = Http::get($url);
            if (!$response->successful()) {
                break;
            }
            $txs = $response->json() ?? [];
            foreach ($txs as $tx) {
                if (isset($tx['status']['confirmed']) && $tx['status']['confirmed']) {
                    $txnIds[] = $tx['txid'];
                }
            }
            $lastSeen = !empty($txs) ? end($txs)['txid'] : null;
        } while (count($txs) >= 25);

        return $txnIds;
    }

    private function getSolanaOnChainTxnIds(string $walletAddress): array
    {
        $txnIds = [];
        $rpcUrl = 'https://api.mainnet-beta.solana.com';
        $response = Http::post($rpcUrl, [
            'jsonrpc' => '2.0', 'id' => 1,
            'method' => 'getSignaturesForAddress',
            'params' => [$walletAddress, ['limit' => 100]],
        ]);
        if ($response->successful() && isset($response['result'])) {
            foreach ($response['result'] as $tx) {
                $txnIds[] = $tx['signature'];
            }
        }
        return $txnIds;
    }

    private function getXrpOnChainTxnIds(string $walletAddress): array
    {
        $txnIds = [];
        $response = Http::post('https://s2.ripple.com:51234', [
            'method' => 'account_tx',
            'params' => [[
                'account' => $walletAddress,
                'ledger_index_min' => -1, 'ledger_index_max' => -1,
                'limit' => 100,
            ]],
        ]);
        if ($response->successful()) {
            $txs = $response->json()['result']['transactions'] ?? [];
            foreach ($txs as $data) {
                $txnIds[] = $data['tx']['hash'] ?? '';
            }
        }
        return array_filter($txnIds);
    }

    private function getTronOnChainTxnIds(string $walletAddress): array
    {
        $txnIds = [];
        $response = Http::get("https://api.trongrid.io/v1/accounts/{$walletAddress}/transactions");
        if ($response->successful()) {
            $txs = $response->json()['data'] ?? [];
            foreach ($txs as $tx) {
                if (isset($tx['ret'][0]['contractRet']) && $tx['ret'][0]['contractRet'] === 'SUCCESS') {
                    $txnIds[] = $tx['txID'] ?? '';
                }
            }
        }
        return array_filter($txnIds);
    }

    private function getEthereumOnChainTxnIds(Wallet $wallet): array
    {
        $walletAddress = $wallet->address;
        $txnIds = [];
        $apiUrls = [
            ['url' => 'https://api.polygonscan.com/api', 'token' => env('POLYSCAN_API_TOKEN')],
            ['url' => 'https://api.etherscan.io/api', 'token' => env('ETHERSCAN_API_TOKEN')],
        ];
        foreach ($apiUrls as $item) {
            foreach (['txlist', 'tokentx'] as $action) {
                $response = Http::get($item['url'], [
                    'module' => 'account', 'action' => $action,
                    'address' => $walletAddress,
                    'startblock' => 0, 'endblock' => 99999999,
                    'sort' => 'desc', 'apikey' => $item['token'],
                ]);
                if ($response->successful() && is_array($response->json()['result'] ?? null)) {
                    foreach ($response->json()['result'] as $tx) {
                        $txnIds[] = $tx['hash'] ?? '';
                    }
                }
            }
        }
        return array_filter(array_unique($txnIds));
    }

    public function getBitcoinTransactions(Wallet $wallet)
    {
        $walletAddress = $wallet->address;
        $crypto = Crypto::query()->find($wallet->crypto_id);
        $sbxWhitelist = Whitelist::query()->where('is_active', '=', 1)->first();
        $this->logVerbose("GET blockstream.info/api/address/{$walletAddress}/txs");
        $response = Http::timeout(30)->get("https://blockstream.info/api/address/{$walletAddress}/txs");
        $this->logVerbose("  -> HTTP {$response->status()}");
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
                            'account_wallet_address' => (new WalletController())->getPrimaryWalletByTransactionWallet($inputAddresses[0]),
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

    public function getSolanaTransactions(Wallet $wallet)
    {
        $walletAddress = $wallet->address;
        $crypto = Crypto::query()->find($wallet->crypto_id);
        $sbxWhitelist = Whitelist::query()->where('is_active', '=', 1)->first();
        $result  = [];
        $rpcUrl = 'https://api.mainnet-beta.solana.com';

        $this->logVerbose("POST {$rpcUrl} getSignaturesForAddress");
        $response = Http::timeout(30)->post($rpcUrl, [
            'jsonrpc' => '2.0',
            'id' => 1,
            'method' => 'getSignaturesForAddress',
            'params' => [$walletAddress, ['limit' => 10]],
        ]);
        $this->logVerbose("  -> HTTP {$response->status()}, result=" . (isset($response['result']) ? count($response['result']) . ' sigs' : 'null'));

        if ($response->successful() && isset($response['result'])) {
            foreach ($response['result'] as $idx => $txMeta) {
                $signature = $txMeta['signature'];
                $this->logVerbose("  getTransaction sig #" . ($idx + 1) . " " . substr($signature, 0, 16) . '...');

                $txResponse = Http::timeout(30)->post($rpcUrl, [
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
                                    'account_wallet_address' => (new WalletController())->getPrimaryWalletByTransactionWallet($from),
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

    public function getXrpTransactions(Wallet $wallet)
    {
        $walletAddress = $wallet->address;
        $crypto = Crypto::query()->find($wallet->crypto_id);
        $sbxWhitelist = Whitelist::query()->where('is_active', '=', 1)->first();
        $result = [];
        $rpcUrl = 'https://s2.ripple.com:51234';

        $this->logVerbose("POST s2.ripple.com:51234 account_tx");
        $response = Http::timeout(30)->post($rpcUrl, [
            'method' => 'account_tx',
            'params' => [[
                'account' => $walletAddress,
                'ledger_index_min' => -1,
                'ledger_index_max' => -1,
                'limit' => 10,
            ]],
        ]);
        $this->logVerbose("  -> HTTP {$response->status()}");

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
                            'account_wallet_address' => (new WalletController())->getPrimaryWalletByTransactionWallet($from),
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

    public function getTronTransactions(Wallet $wallet)
    {
        $walletAddress = $wallet->address;
        $crypto = Crypto::query()->find($wallet->crypto_id);
        $sbxWhitelist = Whitelist::query()->where('is_active', '=', 1)->first();
        $this->logVerbose("GET api.trongrid.io/v1/accounts/{$walletAddress}/transactions");
        $response = Http::timeout(30)->get("https://api.trongrid.io/v1/accounts/{$walletAddress}/transactions");
        $this->logVerbose("  -> HTTP {$response->status()}");

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
                                'account_wallet_address' => (new WalletController())->getPrimaryWalletByTransactionWallet($from),
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

    public function getOtherTransactions(Wallet $wallet)
    {
        $walletAddress = $wallet->address;
        $sbxWhitelist = Whitelist::query()->where('is_active', '=', 1)->first();
        $apiUrls = [
            'polygon' => [
                'url' => 'https://api.polygonscan.com/api',
                'token' => env('POLYSCAN_API_TOKEN'),
                'actions' => [
                    'txlist',
                    'tokentx'
                ],
                'crypto_id' => 10,
                'crypto_network_id' => 4,
                'chain_id' => 137,
                'chain_name' => 'Polygon'
            ],
            'mainnet' => [
                'url' => 'https://api.etherscan.io/api',
                'token' => env('ETHERSCAN_API_TOKEN'),
                'actions' => ['txlist', 'tokentx'],
                'crypto_id' => 2,
                'crypto_network_id' => 1,
                'chain_id' => 1,
                'chain_name' => 'Ethereum'

            ],
//            'sepolia' => 'https://api-sepolia.etherscan.io/api',
        ];

        $delimeter = [
            'txlist' => 1e18,
            'tokentx' => 1e6,
        ];

        foreach ($apiUrls as $network => $item) {
            foreach ($item['actions'] as $action) {
                $this->logVerbose("GET {$item['url']} action={$action} (network={$network})");
                $response = Http::timeout(30)->get($item['url'], [
                    'module' => 'account',
                    'action' => $action,
                    'address' => $walletAddress,
                    'startblock' => 0,
                    'endblock' => 99999999,
                    'sort' => 'desc',
                    'apikey' => $item['token'],
                ]);
                $result = $response->json()['result'] ?? null;
                $this->logVerbose("  -> HTTP {$response->status()}, result=" . (is_array($result) ? count($result) . ' tx(s)' : json_encode($result)));

                if (!is_array($result)) {
                    Log::warning(json_encode($response->json()));
                }

                foreach ($result ?? [] as $tx) {

                    if ($action === 'tokentx' || (isset($tx['txreceipt_status']) && $tx['txreceipt_status'] === "1")) {
                        if ($action === 'tokentx') {
                            $crypto = Crypto::query()->where('symbol', '=', $tx['tokenSymbol'])->first();
                        } else {
                            $crypto = Crypto::query()->find($item['crypto_id']);
                        }

                        if ($crypto) {
                            $transaction = PresaleTransaction::query()->updateOrCreate([
                                'txn_id' => $tx['hash']
                            ],
                                [
                                    'account_wallet_address' => (new WalletController())->getPrimaryWalletByTransactionWallet($tx['from']),
                                    'wallet_address' => $tx['from'] ?? 'unknown',
                                    'amount' => round(($tx['value'] / $delimeter[$action]), 6),
                                    'crypto_id' => $crypto->id,
                                    'usdt_amount' => round($tx['value'] / $delimeter[$action] * $crypto->price, 6),
                                    'sbx_price' => round($tx['value'] / $delimeter[$action] * $crypto->price / $sbxWhitelist->sbxPrice, 6),
                                    'transaction_confirmation' => 'Confirmed via chain status tracking',
                                    'txn_id' => $tx['hash'],
                                    'crypto_network_id' => $item['crypto_network_id'],
                                    'system_wallet_id' => $wallet->id,
                                    'system_wallet' => $tx['to'],
                                    'chain_id' => $item['chain_id'],
                                    'chain_name' => $item['chain_name'],
                                ]);
                            $this->info('Recognized transaction: ' . $transaction->id);
                        }
                    }
                }
            }

        }
    }

    public function handleTransactions(Wallet $wallet)
    {
                $this->logVerbose("handleTransactions: wallet " . substr($wallet->address, 0, 10) . '... (' . ($wallet->crypto?->symbol ?? '?') . ')');
                if ($wallet->crypto?->symbol === 'BTC') {
                    $this->getBitcoinTransactions($wallet);
                } else if ($wallet->crypto?->symbol === 'SOL') {
                    $this->getSolanaTransactions($wallet);
                } else if ($wallet->crypto?->symbol === 'XRP') {
                    $this->getXrpTransactions($wallet);
                } else if ($wallet->crypto?->symbol === 'TRX') {
                    $this->getTronTransactions($wallet);
                } else {
                    $this->getOtherTransactions($wallet);
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
