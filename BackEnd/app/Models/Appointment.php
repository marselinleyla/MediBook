<?php
// Appointment model — links a user (patient) to a doctor for a scheduled visit.
// Tracks date, time, cancellation status, and consultation type.

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
  use HasFactory;

  // Mass-assignable columns including foreign keys and appointment details.
  protected $fillable = [
    'user_id',
    'doctor_id',
    'date_appointment',
    'time_appointment',
    'cancel_appointment',
    'type_appointment'
  ];

  // Cast cancel_appointment to boolean for clean conditional checks.
  protected $casts = [
    'cancel_appointment' => 'boolean',
  ];

  // Inverse relationship: each appointment belongs to one user (patient).
  public function user()
  {
    return $this->belongsTo(User::class);
  }

  // Inverse relationship: each appointment belongs to one doctor.
  public function doctor()
  {
    return $this->belongsTo(Doctor::class);
  }
}
