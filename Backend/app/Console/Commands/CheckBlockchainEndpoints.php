<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class CheckBlockchainEndpoints extends Command
{
    protected $signature = 'app:check-blockchain-endpoints';

    protected $description = 'Verify blockchain API endpoints used for rescan are reachable and responding';

    /** Known mainnet transaction IDs for connectivity checks */
    private const TEST_TX_IDS = [
        'BTC' => '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
        'ETH' => '0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060',
        'MATIC' => '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
        'SOL' => '5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnb',
        'XRP' => '1B8590C01B0006EDFA9ED60296DD3D3C61485F2642819B9166CADF32C5790F42',
        // TRX uses wallet/getnowblock for connectivity check
    ];

    public function handle(): int
    {
        $this->info('Checking blockchain endpoints used by rescan...');
        $this->newLine();

        $results = $this->runChecks();

        $this->table(['Endpoint', 'Status', 'Details'], array_map(
            fn ($label, $r) => [$label, $r['ok'] ? 'OK' : 'FAIL', $r['message']],
            array_keys($results),
            array_values($results)
        ));

        $failed = count(array_filter($results, fn ($r) => !$r['ok']));
        if ($failed > 0) {
            $this->error("{$failed} endpoint(s) failed. Rescan may not work correctly for those chains.");
            return 1;
        }

        $this->info('All endpoints OK.');
        return 0;
    }

    /** Run all checks and return results (for CLI or JSON API). */
    public static function runChecks(): array
    {
        $command = resolve(self::class);
        return [
            'BTC (Blockstream)' => $command->checkBitcoin(),
            'ETH (Etherscan)' => $command->checkEthereum(),
            'MATIC (Polygonscan)' => $command->checkPolygon(),
            'SOL (Solana RPC)' => $command->checkSolana(),
            'TRX (Trongrid)' => $command->checkTron(),
            'XRP (Ripple)' => $command->checkXrp(),
        ];
    }

    private function checkBitcoin(): array
    {
        $txnId = self::TEST_TX_IDS['BTC'];
        $url = "https://blockstream.info/api/tx/{$txnId}";
        try {
            $response = Http::timeout(15)->get($url);
            $ok = $response->successful();
            $body = $response->json();
            return [
                'ok' => $ok,
                'message' => $ok ? 'HTTP ' . $response->status() . ', tx found' : 'HTTP ' . $response->status() . ': ' . ($response->body() ?: 'no body'),
            ];
        } catch (\Throwable $e) {
            return ['ok' => false, 'message' => $e->getMessage()];
        }
    }

    private function checkEthereum(): array
    {
        $txnId = self::TEST_TX_IDS['ETH'];
        $url = 'https://api.etherscan.io/api';
        try {
            $response = Http::timeout(15)->get($url, [
                'module' => 'proxy',
                'action' => 'eth_getTransactionByHash',
                'txhash' => $txnId,
                'apikey' => env('ETHERSCAN_API_TOKEN'),
            ]);
            $result = $response->json()['result'] ?? null;
            $ok = $response->successful() && $result !== null && $result !== false;
            return [
                'ok' => $ok,
                'message' => $ok ? 'HTTP ' . $response->status() . ', tx found' : 'HTTP ' . $response->status() . ', result=' . json_encode($result),
            ];
        } catch (\Throwable $e) {
            return ['ok' => false, 'message' => $e->getMessage()];
        }
    }

    private function checkPolygon(): array
    {
        $txnId = self::TEST_TX_IDS['MATIC'];
        $url = 'https://api.polygonscan.com/api';
        try {
            $response = Http::timeout(15)->get($url, [
                'module' => 'proxy',
                'action' => 'eth_getTransactionByHash',
                'txhash' => $txnId,
                'apikey' => env('POLYSCAN_API_TOKEN'),
            ]);
            $result = $response->json()['result'] ?? null;
            $ok = $response->successful() && $result !== null && $result !== false;
            return [
                'ok' => $ok,
                'message' => $ok ? 'HTTP ' . $response->status() . ', tx found' : 'HTTP ' . $response->status() . ', result=' . json_encode($result),
            ];
        } catch (\Throwable $e) {
            return ['ok' => false, 'message' => $e->getMessage()];
        }
    }

    private function checkSolana(): array
    {
        $txnId = self::TEST_TX_IDS['SOL'];
        $url = 'https://api.mainnet-beta.solana.com';
        try {
            $response = Http::timeout(15)->post($url, [
                'jsonrpc' => '2.0',
                'id' => 1,
                'method' => 'getTransaction',
                'params' => [$txnId, 'jsonParsed'],
            ]);
            $json = $response->json();
            $ok = $response->successful() && (isset($json['result']) || isset($json['error']));
            $msg = $ok ? 'HTTP ' . $response->status() . ', RPC OK' : 'HTTP ' . $response->status();
            return ['ok' => $ok, 'message' => $msg];
        } catch (\Throwable $e) {
            return ['ok' => false, 'message' => $e->getMessage()];
        }
    }

    private function checkTron(): array
    {
        $url = 'https://api.trongrid.io/wallet/getnowblock';
        try {
            $response = Http::timeout(15)->get($url);
            $ok = $response->successful();
            $data = $response->json();
            $hasBlock = !empty($data['block_header'] ?? null) || isset($data['blockID']);
            return [
                'ok' => $ok,
                'message' => $ok ? 'HTTP ' . $response->status() . ($hasBlock ? ', API OK' : ', reachable') : 'HTTP ' . $response->status(),
            ];
        } catch (\Throwable $e) {
            return ['ok' => false, 'message' => $e->getMessage()];
        }
    }

    private function checkXrp(): array
    {
        $txnId = self::TEST_TX_IDS['XRP'];
        $url = 'https://s2.ripple.com:51234';
        try {
            $response = Http::timeout(15)->post($url, [
                'method' => 'tx',
                'params' => [['transaction' => $txnId]],
            ]);
            $result = $response->json()['result'] ?? [];
            $ok = $response->successful();
            $txFound = ($result['validated'] ?? false) === true || isset($result['hash']);
            return [
                'ok' => $ok,
                'message' => $ok ? 'HTTP ' . $response->status() . ($txFound ? ', tx found' : ', API reachable') : 'HTTP ' . $response->status(),
            ];
        } catch (\Throwable $e) {
            return ['ok' => false, 'message' => $e->getMessage()];
        }
    }
}
