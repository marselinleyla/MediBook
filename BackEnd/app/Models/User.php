<?php
// User model — represents a patient registered on the platform.
// Extends Authenticatable for authentication via Sanctum and implements MustVerifyEmail
// to enforce email verification before accessing certain features.

namespace App\Models;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
  use HasApiTokens, HasFactory, Notifiable;

  // Columns that can be mass-assigned via create() or fill().
  protected $fillable = [
    'firstname',
    'lastname',
    'cin',
    'phoneNumber',
    'email',
    'password',
    'user_avatar'
  ];

  // Sensitive fields excluded from JSON serialization.
  protected $hidden = [
    'password',
    'remember_token',
  ];

  // Override the default email notification to use Laravel's built-in VerifyEmail.
  public function sendEmailVerificationNotification()
  {
    $this->notify(new VerifyEmail);
  }

  // Type casting for attribute values when retrieved from the database.
  protected $casts = [
    'email_verified_at' => 'datetime',
  ];

  // Relationship: a user can have many appointments.
  public function appointments()
  {
    return $this->hasMany(Appointment::class);
  }
}
