<?php
// Contact controller — handles "Contact Us" form submissions.
// Stores the message in the database and sends an email notification to the site owner.

namespace App\Http\Controllers;

use App\Mail\ContactMessageMail;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
  public function send(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'name' => 'required|string|max:255',
      'email' => 'required|email|max:255',
      'message' => 'required|string',
    ]);

    if ($validator->fails()) {
      return response(['errors' => $validator->errors()], 422);
    }

    $data = $validator->validated();

    // Persist the contact message in the database.
    ContactMessage::create($data);

    // Send an email notification to the admin.
    Mail::to('marselinleyla@gmail.com')->send(new ContactMessageMail($data));

    return response([
      'success' => true,
      'message' => 'Your message has been sent successfully. We will get back to you shortly.',
    ], 200);
  }
}
