<?php

namespace App\Imports;

use App\Models\CodeForLogin;
use Maatwebsite\Excel\Concerns\ToModel;

class CodesForLoginImport implements ToModel
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    final public function model(array $row): CodeForLogin
    {
        return new CodeForLogin([
            'code'  => $row[0],
            'nameOfPerson' => $row[1],
            'email' => $row[2],
            'phone' => $row[3]
        ]);
    }
}
