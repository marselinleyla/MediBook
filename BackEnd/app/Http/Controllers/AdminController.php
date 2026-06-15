<?php
// Admin controller — handles listing/verification of doctors, listing patients, and admin profile updates.

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Doctor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
  // Returns all doctors in the system.
  public function GetAllDocter()
  {
    $doctor = Doctor::all();
    return response()->json($doctor);
  }

  // Returns all registered patients (users).
  public function GetAllPatient()
  {
    $user = User::all();
    return response()->json($user);
  }

  // Approves a doctor by setting verified = true.
  public function VerifiedDoctor(Request $request)
  {

    $id = $request->post('id');

    $doctor = Doctor::find($id);
    $doctor->verified = true;
    $doctor->save();

    $doctor = Doctor::all();

    return response()->json($doctor);
  }

  // Returns all doctors who are not yet verified.
  public function DoctorNoVerified()
  {
    $doctors = Doctor::where('verified', false)->get();
    return response()->json($doctors);
  }

  // Returns doctors who registered today.
  public function getDoctorsRegisteredToday()
  {
    $doctors = Doctor::whereDate('created_at', Carbon::today())
      ->orderBy('created_at', 'desc')
      ->get();
    return response()->json($doctors);
  }

  // Returns the count of doctors registered today.
  public function getDoctorsRegisteredTodayCount()
  {
    $count = Doctor::whereDate('created_at', Carbon::today())->count();
    return response()->json(['count' => $count]);
  }

  // Updates admin email and/or password.
  public function updateInfo(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'email' => 'nullable|email|unique:admins,email,' . $request->user()->id,
      'current_password' => 'required_with:new_password',
      'new_password' => 'nullable|min:8|confirmed',
    ]);

    if ($validator->fails()) {
      return response(['errors' => $validator->errors()], 422);
    }

    $admin = Admin::find($request->user()->id);

    if ($request->filled('email')) {
      $admin->email = $request->email;
    }

    if ($request->filled('new_password')) {
      if (!Hash::check($request->current_password, $admin->password)) {
        return response(['errors' => ['current_password' => ['Current password is incorrect.']]], 422);
      }
      $admin->password = Hash::make($request->new_password);
    }

    $admin->save();

    return response([
      'updated' => 'success',
      'admin' => $admin
    ], 200);
  }
}
