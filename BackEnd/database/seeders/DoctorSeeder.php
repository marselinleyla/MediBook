<?php

/**
 * DoctorSeeder
 *
 * Creates 20 sample doctors using the DoctorFactory.
 * Each doctor has randomized personal info, specialties, and work schedules.
 * Run with: php artisan db:seed --class=DoctorSeeder
 */

namespace Database\Seeders;

use App\Models\Doctor;
use DB;
use Illuminate\Database\Seeder;

class DoctorSeeder extends Seeder
{
    public function run()
    {
        Doctor::factory()->count(20)->create();
        
    } 
}
