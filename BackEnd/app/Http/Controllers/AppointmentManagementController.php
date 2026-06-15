<?php
// Controller handling all appointment operations: creation, listing by date ranges, and PDF receipt generation.

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class AppointmentManagementController extends Controller
{

  // Creates a new appointment and generates a PDF receipt.
  // Only allows booking with doctors who are admin-verified AND email-verified.
  public function TakeAppointment(Request $request)
  {

    $validator = Validator::make($request->all(), [
      'user_id' => 'required|exists:users,id',
      'doctor_id' => 'required|exists:doctors,id',
      'date_appointment' => 'required',
      'time_appointment' => 'required',
      'type_appointment' => 'required'
    ]);

    $this->validateWith($validator, $request);

    $data = $validator->validated();

    // Reject booking if doctor is not yet approved or email-verified.
    $doctorCheck = Doctor::where('id', $data['doctor_id'])
      ->where('verified', true)
      ->whereNotNull('email_verified_at')
      ->exists();

    if (!$doctorCheck) {
      return response([
        'error' => 'This doctor is not yet available for appointments. Please contact support.',
      ], 403);
    }

    // Save the appointment record.
    $appointment = Appointment::create([
      'user_id' => $data['user_id'],
      'doctor_id' => $data['doctor_id'],
      'date_appointment' => $data['date_appointment'],
      'time_appointment' => $data['time_appointment'],
      'type_appointment' => $data['type_appointment']
    ]);

    $doctor = Doctor::find($data['doctor_id']);
    $user = User::find($data['user_id']);

    $DataView = [
      'doctor' => $doctor,
      'user' => $user,
      'appointment' => $appointment
    ];

    // Generate and store a PDF receipt for the appointment.
    $pdf = Pdf::loadView('Appointment', $DataView);

    $nameFile = $user->firstname . time() . '.pdf';

    Storage::put('public/storage/pdf/' . $nameFile, $pdf->output());

    return response([
      'appointment' => $appointment,
      "namefile" => $nameFile
    ], 200);
  }


  // Returns all appointments for a specific doctor.
  public function GetAppointmentDoctor($id)
  {

    $appointments = Appointment::with('user')
      ->where('doctor_id', $id)
      ->get();

    return response()->json($appointments);
  }


  // Returns today's non-cancelled appointments for a doctor, ordered by time.
  public function GetAppointmentToday($doctorId)
  {
    $appointments = Appointment::with('user')
      ->where('doctor_id', $doctorId)
      ->where('cancel_appointment', false)
      ->whereDate('date_appointment', Carbon::today())
      ->orderBy('time_appointment')
      ->get();

    return response()->json($appointments);
  }

  // Returns past (old) appointments for a doctor (history).
  public function GetAppointmentOldDate($doctorId)
  {

    $appointments = Appointment::with('user')
      ->where('doctor_id', $doctorId)
      ->where(function ($q) {
          $q->whereDate('date_appointment', '<', Carbon::today())
            ->orWhere('cancel_appointment', true);
      })
      ->get();

    return response()->json($appointments);
  }

  // Returns future (upcoming) appointments for a doctor.
  public function GetNewAppointment($doctorId)
  {

    $appointments = Appointment::with('user')
      ->where('doctor_id', $doctorId)
      ->where('cancel_appointment', false)
      ->whereDate('date_appointment', '>', Carbon::today())
      ->get();

    return response()->json($appointments);
  }

  // Returns all appointments (non-cancelled) for a user (patient), newest first.
  public function GetUserAppointments($userId)
  {
    $appointments = Appointment::with('doctor')
      ->where('user_id', $userId)
      ->where('cancel_appointment', false)
      ->orderBy('date_appointment', 'desc')
      ->orderBy('time_appointment', 'desc')
      ->get();

    return response()->json($appointments);
  }

  // Returns all cancelled appointments for a given user (patient).
  public function GetUserCancelledAppointments($userId)
  {
    $appointments = Appointment::with('doctor')
      ->where('user_id', $userId)
      ->where('cancel_appointment', true)
      ->orderBy('date_appointment', 'desc')
      ->get();

    return response()->json($appointments);
  }

  // Marks an appointment as cancelled (cancel_appointment = true).
  public function CancelAppointment(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'id' => 'required|exists:appointments,id',
    ]);

    if ($validator->fails()) {
      return response(['errors' => $validator->errors()], 422);
    }

    $appointment = Appointment::find($request->id);
    $appointment->cancel_appointment = true;
    $appointment->save();

    return response([
      'success' => true,
      'appointment' => $appointment,
    ], 200);
  }
}
