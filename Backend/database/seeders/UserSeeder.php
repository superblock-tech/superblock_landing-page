<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'admin',
                'email' => 'admin1991@admin.com',
                'password' => bcrypt('admin'),
                'role_id' => 1,
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
