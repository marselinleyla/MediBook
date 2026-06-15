<?php
// Doctor authentication controller — handles registration, login, logout, and email verification for doctors.

namespace App\Http\Controllers\Auth\Doctor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Doctor\LoginRequest;
use App\Http\Requests\Doctor\RegisterRequest;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class DoctorAuthController extends Controller
{

  // Registers a new doctor account and sends an email verification notification.
  public function register(RegisterRequest $request)
  {
    $data = $request->validated();

    $doctor = Doctor::create(
      [
        'firstname' => $data['firstname'],
        'lastname' => $data['lastname'],
        'phoneNumber' => $data['phoneNumber'],
        'email' => $data['email'],
        'password' => bcrypt($data['password']),
        'Matricule' => $data['Matricule']
      ]
    );

    $doctor->sendEmailVerificationNotification();

    $token = $doctor->createToken('mainDoctor')->plainTextToken;
    $doctorData = Doctor::find($doctor->id);

    return  response(
      [
        'doctor' => $doctorData,
        'token' => $token
      ],
      200
    );
  }

  // Authenticates a doctor with email and password using Hash::check (since guard driver differs).
  public function login(LoginRequest $request)
  {
    $credentials = $request->validated();

    $doctor = Doctor::where('email', $credentials['email'])->first();

    if (!$doctor || !Hash::check($credentials['password'], $doctor->password)) {
      return response(['message' => 'Invalid login credentials'], 422);
    }

    $token = $doctor->createToken('mainDoctor')->plainTextToken;

    return response([
      'token' => $token,
      'doctor' => $doctor
    ], 200);
  }

  // Revokes the current API token.
  public function logout()
  {
    $user = Auth::user();

    $user->currentAccessToken()->delete();

    return response([
      'success' => true
    ]);
  }

  // Returns the authenticated doctor's data.
  public function doctor(Request $request)
  {
    return response($request->user(), 200);
  }

  // Verifies doctor email via signed URL and redirects to frontend.
  public function verify($id, Request $request)
  {
    if (!$request->hasValidSignature()) {
      return response()->json(["msg" => "Invalid/Expired url provided."], 401);
    }
    $doctor = Doctor::find($id);
    if (!$doctor->hasVerifiedEmail()) {
      $doctor->markEmailAsVerified();
    }
    $URL = config("services.frontend.redirect_doctor");
    return redirect($URL);
  }

  // Resends the email verification link.
  public function resend($id)
  {
    $doctor = Doctor::find($id);
    if ($doctor->hasVerifiedEmail()) {
      return response()->json(["msg" => "Email already verified."], 400);
    }

    $doctor->sendEmailVerificationNotification();

    return response()->json(["msg" => "Email verification link sent on your email id"]);
  }
}
