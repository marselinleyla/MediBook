<?php

/**
 * UserSeeder
 *
 * Creates 20 sample users (patients) using the UserFactory.
 * Each user has randomized personal info with a default password ('password').
 * Run with: php artisan db:seed --class=UserSeeder
 */

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::factory()->count(20)->create();
    }
}
