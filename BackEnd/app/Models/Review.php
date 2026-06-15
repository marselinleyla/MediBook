<?php
// Review model — represents a rating and comment left by a user for a doctor.
// Uses a unique constraint on (doctor_id, user_id) so each user can leave only one review per doctor.

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
  use HasFactory;

  // Fillable: doctor_id and user_id define the relationship, rating is numeric (1-5), comment is optional text.
  protected $fillable = [
    'doctor_id',
    'user_id',
    'rating',
    'comment',
  ];

  // Inverse relationship: each review belongs to one doctor.
  public function doctor()
  {
    return $this->belongsTo(Doctor::class);
  }

  // Inverse relationship: each review belongs to one user (patient).
  public function user()
  {
    return $this->belongsTo(User::class);
  }
}
