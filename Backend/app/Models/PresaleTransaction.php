<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PresaleTransaction extends Model
{
    use HasFactory;

    /** Known testnet chain IDs (public for scope) */
    public const TESTNET_CHAIN_IDS = [
        5,        // Goerli
        11155111, // Sepolia
        80002,    // Polygon Amoy
        97,       // BSC Testnet
        43113,    // Avalanche Fuji
        421614,   // Arbitrum Sepolia
        84532,    // Base Sepolia
        534351,   // Scroll Sepolia
    ];

    /** Chain name keywords indicating testnet */
    public const TESTNET_CHAIN_KEYWORDS = [
        'testnet', 'sepolia', 'goerli', 'amoy', 'fuji', 'holesky',
    ];

    protected $fillable = [
        'wallet_address',
        'amount',
        'crypto_id',
        'usdt_amount',
        'sbx_price',
        'transaction_confirmation',
        'txn_id',
        'crypto_network_id',
        'system_wallet',
        'system_wallet_id',
        'account_wallet_address',
        'chain_id',
        'chain_name'
    ];


    public function crypto()
    {
        return $this->belongsTo(Crypto::class);
    }

    public function cryptoNetwork()
    {
        return $this->belongsTo(CryptoNetwork::class);
    }

    public function systemWalletObject()
    {
        return $this->hasOne(Wallet::class, 'id', 'system_wallet_id');
    }

    /**
     * Parse chain_id to integer, supporting decimal and hex (0x...) formats.
     */
    private static function parseChainId(?string $chainId): ?int
    {
        if ($chainId === null || trim($chainId) === '') {
            return null;
        }
        $chainId = trim((string) $chainId);
        if (str_starts_with(strtolower($chainId), '0x')) {
            return (int) hexdec(substr($chainId, 2));
        }
        return (int) $chainId;
    }

    public function isTestnet(): bool
    {
        $parsed = self::parseChainId($this->chain_id);
        if ($parsed !== null && in_array($parsed, self::TESTNET_CHAIN_IDS)) {
            return true;
        }
        $chainName = $this->chain_name ? trim(strtolower((string) $this->chain_name)) : '';
        if ($chainName !== '') {
            foreach (self::TESTNET_CHAIN_KEYWORDS as $keyword) {
                if (str_contains($chainName, $keyword)) {
                    return true;
                }
            }
        }
        $networkName = trim(strtolower((string) ($this->cryptoNetwork?->name ?? '')));
        if ($networkName !== '') {
            foreach (self::TESTNET_CHAIN_KEYWORDS as $keyword) {
                if (str_contains($networkName, $keyword)) {
                    return true;
                }
            }
        }
        // Also check transaction_confirmation (chain info can be embedded there, e.g. "Local transaction. Chain ID: 11155111 Chain name: Sepolia")
        $confirmation = trim(strtolower((string) ($this->transaction_confirmation ?? '')));
        if ($confirmation !== '') {
            foreach (self::TESTNET_CHAIN_IDS as $testnetId) {
                if (str_contains($confirmation, (string) $testnetId)) {
                    return true;
                }
            }
            foreach (self::TESTNET_CHAIN_KEYWORDS as $keyword) {
                if (str_contains($confirmation, $keyword)) {
                    return true;
                }
            }
        }
        return false;
    }

    /** All testnet chain ID values for DB comparison (decimal + hex, normalized) */
    private static function getTestnetChainIdValuesForScope(): array
    {
        $values = array_map('strval', self::TESTNET_CHAIN_IDS);
        foreach (self::TESTNET_CHAIN_IDS as $id) {
            $values[] = '0x' . dechex($id);
        }
        return array_values(array_unique(array_map('strtolower', $values)));
    }

    public function scopeExcludeTestnet(Builder $query): Builder
    {
        $testnetValues = self::getTestnetChainIdValuesForScope();
        $placeholders = implode(',', array_fill(0, count($testnetValues), '?'));

        return $query
            ->where(function (Builder $q) use ($testnetValues, $placeholders) {
                $q->whereNull('chain_id')
                    ->orWhereRaw('TRIM(COALESCE(chain_id, \'\')) = ?', [''])
                    ->orWhereRaw('LOWER(TRIM(chain_id)) NOT IN (' . $placeholders . ')', $testnetValues);
            })
            ->where(function (Builder $q) {
                foreach (self::TESTNET_CHAIN_KEYWORDS as $keyword) {
                    $q->whereRaw('(COALESCE(TRIM(chain_name), \'\') = \'\' OR LOWER(TRIM(chain_name)) NOT LIKE ?)', ['%' . $keyword . '%']);
                }
            })
            ->where(function (Builder $q) {
                $q->whereNull('crypto_network_id')
                    ->orWhereDoesntHave('cryptoNetwork', function (Builder $sub) {
                        $sub->where(function (Builder $inner) {
                            foreach (self::TESTNET_CHAIN_KEYWORDS as $keyword) {
                                $inner->orWhereRaw('LOWER(TRIM(name)) LIKE ?', ['%' . $keyword . '%']);
                            }
                        });
                    });
            })
            ->where(function (Builder $q) {
                $q->whereNull('transaction_confirmation')
                    ->orWhereRaw('TRIM(COALESCE(transaction_confirmation, \'\')) = ?', [''])
                    ->orWhere(function (Builder $q2) {
                        // Only check chain IDs 6+ chars to avoid false positives (e.g. "5" in "5 confirmations")
                        foreach (self::TESTNET_CHAIN_IDS as $testnetId) {
                            if (strlen((string) $testnetId) >= 5) {
                                $q2->whereRaw('COALESCE(transaction_confirmation, \'\') NOT LIKE ?', ['%' . $testnetId . '%']);
                            }
                        }
                        foreach (self::TESTNET_CHAIN_KEYWORDS as $keyword) {
                            $q2->whereRaw('LOWER(COALESCE(transaction_confirmation, \'\')) NOT LIKE ?', ['%' . $keyword . '%']);
                        }
                    });
            });
    }

}
