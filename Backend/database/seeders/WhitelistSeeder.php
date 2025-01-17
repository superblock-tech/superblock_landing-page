<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WhitelistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dataWhiteList = [
            'usdtRaised' => 1000000.21,
            'holders' => 1000,
            'sbxPrice' => 0.005,
            'totalTokens' => 1000000000,
        ];

        \App\Models\Whitelist::create($dataWhiteList);
    }
}
