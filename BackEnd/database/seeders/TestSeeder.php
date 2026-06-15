<?php

/**
 * TestSeeder
 *
 * Creates a single test doctor with known credentials for development/testing.
 * Doctor: John Smith, Cardiology, Heart Care Clinic, Casablanca.
 * Email: marselinleyla@gmail.com, Password: 'password' (hashed).
 */

namespace Database\Seeders;

use App\Models\Doctor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Doctor::create([
            'firstname' => 'John',
            'lastname' => 'Smith',

            'cin' => 'AB123456',

            'phoneNumber' => '0612345678',

            'email' => 'marselinleyla@gmail.com',

            'password' => Hash::make('password'),

            'avatar_doctor' => 'doctor1.jpg',

            'Matricule' => 'DOC123456',

            'about' => 'Experienced cardiologist with more than 10 years in healthcare.',

            'specialite' => 'Cardiology',

            'verified' => true,

            'nom_cabinet' => 'Heart Care Clinic',

            'premium' => true,

            'address_cabinet' => '123 Main Street, Casablanca, Morocco',

            'day_debut_work' => 'lundi',

            'day_fin_work' => 'vendredi',

            'time_debut_work' => '08:00',

            'time_fin_work' => '17:00',

            'appointment_time' => '30',

            'available' => true,

            'email_verified_at' => now(),

            'created_at' => now(),

            'updated_at' => now(),
        ]);
    }
}