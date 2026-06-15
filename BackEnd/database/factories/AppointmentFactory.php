<?php

/**
 * AppointmentFactory
 *
 * Generates fake appointment data for seeding.
 * Randomly assigns existing users (IDs 1-20) and doctors (IDs 1-20).
 * Appointment date is between today and 30 days from now.
 * Types include: urgent, nouveau patient, suivi, diagnostic, consultation.
 */

namespace Database\Factories;

use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppointmentFactory extends Factory
{
  protected $model = Appointment::class;

  public function definition()
  {
    return [
      'user_id' => rand(1, 20), // Adjust the range based on the number of user records you have
      'doctor_id' => rand(1, 20), // Adjust the range based on the number of doctor records you have
      'date_appointment' => Carbon::now()->addDays(rand(1, 30))->toDateString(),
      'time_appointment' => $this->faker->time('H:i'),
      'cancel_appointment' => false,
      'type_appointment' => $this->faker->randomElement(['urgent', 'nouveau patient', 'suivi', 'diagnostic', 'consultation'])
    ];
  }
}
