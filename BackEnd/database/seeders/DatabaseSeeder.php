<?php

/**
 * DatabaseSeeder
 *
 * Main seeder that calls all individual seeders in order:
 * 1. DoctorSeeder (20 doctors)
 * 2. UserSeeder (20 users)
 * 3. AppointmentSeeder (20 appointments linking users & doctors)
 * 4. AdminSeeder (1 admin account)
 * Run with: php artisan db:seed
 */

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Admin;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
  /**
   * Seed the application's database.
   */
  public function run(): void
  {

    $this->call(DoctorSeeder::class);
    $this->call(UserSeeder::class);
    $this->call(SingleUserSeeder::class);
    $this->call(AppointmentSeeder::class);
    $this->call(AdminSeeder::class);

    // \App\Models\User::factory(10)->create();

    // \App\Models\User::factory()->create([
    //     'name' => 'Test User',
    //     'email' => 'test@example.com',
    // ]);
  }
}
