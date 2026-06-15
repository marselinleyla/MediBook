<?php
// DoctorImage model — stores gallery images uploaded by doctors for their practice profile.
// Each image belongs to a single doctor.

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorImage extends Model
{
  use HasFactory;

  // Mass-assignable: doctor_id links to the doctor, image_path stores the file path relative to storage.
  protected $fillable = [
    'doctor_id',
    'image_path',
  ];

  // Inverse relationship: each image belongs to one doctor.
  public function doctor()
  {
    return $this->belongsTo(Doctor::class);
  }
}
