<?php

namespace App\Exports;

use App\Models\Wallet;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class WalletsExport implements FromCollection, WithHeadings
{
    /**
    * @return array
     */
    final public function collection(): Collection
    {
        $wallets = Wallet::with('crypto')
            ->select('id', 'name', 'address', 'crypto_id', 'icon')
            ->get();
        $result = [];
        foreach ($wallets as $wallet) {
            $result[] = [
              'id' => $wallet->id,
              'name' => $wallet->name,
              'address' => $wallet->address,
              'crypto' => $wallet->crypto?->name,
              'icon' => $wallet->icon
            ];
        }

        return collect($result);
    }

    public function headings(): array
    {
        return ["id", "name", "address", "crypto", "icon"];
    }
}
