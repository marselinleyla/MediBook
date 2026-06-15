<?php
// Admin model — represents a platform administrator with full access.
// Does not require email verification (no MustVerifyEmail interface).

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
  use HasApiTokens, HasFactory, Notifiable;

  // Only email and password are needed for admin authentication.
  protected $fillable = [
    'email',
    'password'
  ];

  // Sensitive fields hidden from serialization.
  protected $hidden = [
    'password',
    'remember_token',
  ];

  // Type casting for date attributes.
  protected $casts = [
    'email_verified_at' => 'datetime',
  ];
}
