<?php

namespace App\Exports;

use App\Models\CodeForLogin;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class CodesForLoginExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    final public function collection(): Collection
    {
        return CodeForLogin::query()->select("id", "nameOfPerson", "email", "phone")->get();
    }

    public function headings(): array
    {
        return ["id", "name", "email", "phone"];
    }
}
