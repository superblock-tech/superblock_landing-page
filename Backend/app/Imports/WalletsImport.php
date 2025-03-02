<?php

namespace App\Imports;

use App\Models\Crypto;
use App\Models\Wallet;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Concerns\ToModel;

class WalletsImport implements ToModel
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    final public function model(array $row): Wallet
    {
        $fileContent = file_get_contents($row[3]);
        $fileName = 'wallets/' . uniqid('', true) . '.png';
        Storage::disk('public')->put($fileName, $fileContent);

        $crypto = Crypto::query()->where('name', '=', $row[2])->first();

        return new Wallet([
            'name' => $row[0],
            'address' => $row[1],
            'icon' => $fileName,
            'crypto_id' => $crypto?->id
        ]);
    }
}
