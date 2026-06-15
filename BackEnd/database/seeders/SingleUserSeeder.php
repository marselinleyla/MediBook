<?php

/**
 * SingleUserSeeder
 *
 * Creates 1 sample user (patient) with known credentials for testing.
 * Email: user@example.com
 * Password: password
 * Run with: php artisan db:seed --class=SingleUserSeeder
 */

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class SingleUserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'firstname'   => 'Test',
            'lastname'    => 'User',
            'cin'         => '123456789012',
            'phoneNumber' => '+212600000001',
            'email'       => 'user@example.com',
            'password'    => bcrypt('password'),
        ]);
    }
}
