<?php
// User (patient) authentication controller — handles registration, login, logout, and email verification.

namespace App\Http\Controllers\Auth\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\LoginRequest;
use App\Http\Requests\User\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserAuthController extends Controller
{

  // Registers a new patient account and returns an API token.
  public function register(RegisterRequest $request)
  {
    $data = $request->validated();

    $user = User::create([
      'firstname' => $data['firstname'],
      'lastname' => $data['lastname'],
      'cin' => $data['cin'],
      'phoneNumber' => $data['phoneNumber'],
      'email' => $data['email'] ?? null,
      'password' => bcrypt($data['password'])
    ]);

    $token = $user->createToken('mainUser')->plainTextToken;
    // Send verification email only if an email was provided.
    if (($data['email'] ?? null)) {
      $user->sendEmailVerificationNotification();
    }

    $userData = User::find($user->id);

    return  response(
      [
        'user' => $userData,
        'token' => $token
      ],
      200
    );
  }

  // Authenticates a user with email/password and returns a token.
  public function login(LoginRequest $request)
  {
    $credentials = $request->validated();
    if (!Auth::attempt($credentials)) {
      return response(
        [
          'error' => 'Email or Password not correct'
        ],
        422
      );
    }
    $user = Auth::user();

    $token = $user->createToken('mainUser')->plainTextToken;

    $userData = User::find($user->id);

    return response([
      'user' => $userData,
      'token' => $token
    ]);
  }

  // Revokes the current API token (logout).
  public function logout()
  {
    $user = Auth::user();
    $user->currentAccessToken()->delete();

    return response([
      'success' => true
    ]);
  }

  // Returns the authenticated user's data.
  public function user(Request $request)
  {
    return response($request->user(), 200);
  }

  // Handles email verification link — marks email as verified and redirects to frontend.
  public function verify($id, Request $request)
  {
    if (!$request->hasValidSignature()) {
      return response()->json(["msg" => "Invalid/Expired url provided."], 401);
    }
    $user = User::find($id);
    if (!$user->hasVerifiedEmail()) {
      $user->markEmailAsVerified();
    }
    $URL = config("services.frontend.redirect_user");
    return redirect($URL);
  }

  // Resends the email verification link.
  public function resend($id)
  {
    $user = User::find($id);
    if ($user->hasVerifiedEmail()) {
      return response()->json(["msg" => "Email already verified."], 400);
    }

    $user->sendEmailVerificationNotification();

    return response()->json(["msg" => "Email verification link sent on your email id"]);
  }
}
