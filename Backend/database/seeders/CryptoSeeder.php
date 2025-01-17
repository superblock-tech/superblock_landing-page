<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CryptoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cryptos = [
            [
                'name' => 'BTC',
                'symbol' => 'BTC',
                'price' => 50000,
            ],
            [
                'name' => 'ETH',
                'symbol' => 'ETH',
                'price' => 3000,
            ],
            [
                'name' => 'BNB',
                'symbol' => 'BNB',
                'price' => 2.5,
            ],
            [
                'name' => 'SOL',
                'symbol' => 'SOL',
                'price' => 150,
            ],
            [
                'name' => 'USDT',
                'symbol' => 'USDT',
                'price' => 1,
            ],
        ];

        foreach ($cryptos as $crypto) {
            \App\Models\Crypto::create($crypto);
        }
    }
}
