<?php

/**
 * AdminSeeder
 *
 * Creates the default admin account for platform management.
 * Email: admin@example.com, Password: admin_password (hashed via bcrypt).
 * Run with: php artisan db:seed --class=AdminSeeder
 */

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      Admin::create([
        'email' => 'admin@example.com',
        'password' => bcrypt('admin_password'),
    ]);
    }
}
