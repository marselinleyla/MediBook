<?php
// Admin authentication controller — handles admin login using the 'admin' auth guard.

namespace App\Http\Controllers\Auth\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuthController extends Controller
{
  // Authenticates an admin using the 'admin' guard and returns a Sanctum token.
  public function login(LoginRequest $request)
  {
    $credentials = $request->validated();

    $credentials = $request->only('email', 'password');

    if (Auth::guard('admin')->attempt($credentials)) {

      $doctor = Auth::guard('admin')->user();

      $token = $doctor->createToken('mainAdmin')->plainTextToken;

      return response([
        'token' => $token,
        'admin' => $doctor
      ], 200);
    }

    return response(['message' => 'Invalid login credentials'], 422);
  }

  // Returns the authenticated admin's data.
  public function admin(Request $request)
  {
    return response($request->user(), 200);
  }

  // Revokes the current API token to log out the admin.
  public function logout()
  {
    $admin = Auth::guard('admin')->user();

    $admin->currentAccessToken()->delete();

    return response([
      'success' => true
    ]);
  }

}
