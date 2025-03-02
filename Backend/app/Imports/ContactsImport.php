<?php

namespace App\Imports;

use App\Models\ContactForm;
use Maatwebsite\Excel\Concerns\ToModel;

class ContactsImport implements ToModel
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    final public function model(array $row): ContactForm
    {
        return new ContactForm([
            'fullName' => $row[0],
            'email' => $row[1],
            'phone' => $row[2],
            'joinWhitelist' => $row[3]
        ]);
    }
}
