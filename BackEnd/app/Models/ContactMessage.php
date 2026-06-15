<?php
// ContactMessage model — stores messages submitted through the "Contact Us" form.
// Simple storage with name, email, and message body.

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
  use HasFactory;

  // Only these three fields are allowed for mass assignment.
  protected $fillable = [
    'name',
    'email',
    'message',
  ];
}
