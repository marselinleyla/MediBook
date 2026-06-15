<?php

/**
 * AppointmentSeeder
 *
 * Creates 20 sample appointments using the AppointmentFactory.
 * Appointments are randomly assigned to existing users and doctors.
 * Run with: php artisan db:seed --class=AppointmentSeeder
 */

namespace Database\Seeders;

use App\Models\Appointment;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
  public function run()
  {
    Appointment::factory()->count(20)->create();
  }
}
