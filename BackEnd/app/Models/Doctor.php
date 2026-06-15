<?php
// Doctor model — represents a medical professional registered on the platform.
// Extends Authenticatable with Sanctum API tokens and enforces email verification.

namespace App\Models;

use App\Notifications\VerifyEmailNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Doctor extends Authenticatable implements MustVerifyEmail
{
  use HasApiTokens, HasFactory, Notifiable;

  // All fillable columns including personal info, practice details, availability, and verification status.
  protected $fillable = [
    'firstname',
    'lastname',
    'cin',
    'phoneNumber',
    'email',
    'password',
    'avatar_doctor',
    'Matricule',
    'specialite',
    'nom_cabinet',
    'address_cabinet',
    'day_debut_work',
    'day_fin_work',
    'time_debut_work',
    'time_fin_work',
    'available',
    'premium',
    'about',
    'verified',
    'email_verified_at'
  ];

  // Hidden from JSON responses for security.
  protected $hidden = [
    'password',
    'remember_token',
  ];

  // Attribute type casting.
  protected $casts = [
    'email_verified_at' => 'datetime',
  ];

  // Sends a custom email verification notification (overrides default).
  public function sendEmailVerificationNotification()
  {
    $this->notify(new VerifyEmailNotification);
  }

  // Relationship: one doctor has many appointments.
  public function appointments()
  {
    return $this->hasMany(Appointment::class);
  }

  // Relationship: one doctor has many gallery images.
  public function images()
  {
    return $this->hasMany(DoctorImage::class);
  }

  // Relationship: one doctor has many reviews.
  public function reviews()
  {
    return $this->hasMany(Review::class);
  }

  // Computed attribute: average rating across all reviews.
  public function averageRating()
  {
    return $this->reviews()->avg('rating');
  }

  // Computed attribute: total number of reviews.
  public function reviewsCount()
  {
    return $this->reviews()->count();
  }
}
