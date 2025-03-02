<?php

namespace App\Exports;

use App\Models\ContactForm;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ContactsExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    final public function collection(): Collection
    {
        return ContactForm::query()->select(["id", "fullName", "email", "phone"])->get();
    }

    public function headings(): array
    {
        return ["id", "name", "email", "phone"];
    }
}
