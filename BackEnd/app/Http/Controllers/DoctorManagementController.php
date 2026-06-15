<?php
// Main controller for doctor-related operations: search, profile, gallery, reviews, and working hours.

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\DoctorImage;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DoctorManagementController extends Controller
{

  // Searches doctors by speciality, address, name, or practice name.
  // Only returns doctors who are admin-verified AND email-verified.
  // Returns results with average rating and review count eager-loaded.
  public function searchDoctors(Request $request)
  {
    $specialite = $request->post('specialite');
    $addressCabinet = $request->post('address_cabinet');
    $firstname = $request->post('firstname');
    $nomCabinet = $request->post('nom_cabinet');

    $query = Doctor::query()
      ->where('verified', true)
      ->whereNotNull('email_verified_at')
      ->withAvg('reviews', 'rating')->withCount('reviews');

    if (empty($specialite) && empty($addressCabinet) && empty($firstname) && empty($nomCabinet)) {
      $doctors = $query->get();
    } else {
      // Build a grouped WHERE with OR logic — first match is AND, subsequent are OR.
      $query->where(function ($q) use ($specialite, $addressCabinet, $firstname, $nomCabinet) {
        $first = true;
        if (!empty($specialite)) {
          $q->where('specialite', 'LIKE', "%$specialite%");
          $first = false;
        }
        if (!empty($addressCabinet)) {
          if ($first) {
            $q->where('address_cabinet', 'LIKE', "%$addressCabinet%");
            $first = false;
          } else {
            $q->orWhere('address_cabinet', 'LIKE', "%$addressCabinet%");
          }
        }
        if (!empty($firstname)) {
          if ($first) {
            $q->where('firstname', 'LIKE', "%$firstname%");
            $first = false;
          } else {
            $q->orWhere('firstname', 'LIKE', "%$firstname%");
          }
        }
        if (!empty($nomCabinet)) {
          if ($first) {
            $q->where('nom_cabinet', 'LIKE', "%$nomCabinet%");
            $first = false;
          } else {
            $q->orWhere('nom_cabinet', 'LIKE', "%$nomCabinet%");
          }
        }
      });
      $doctors = $query->get();
    }

    if ($doctors->isNotEmpty()) {
      return response()->json([
        'DataSearch' => $doctors
      ], 200);
    } else {
      return response()->json([
        'message' => 'No doctors found',
        'DataSearch' => []
      ], 200);
    }
  }


  // Returns up to 4 random premium doctors for the homepage carousel.
  // Only returns doctors who are admin-verified AND email-verified.
  public function getRandomPremiumDoctors()
  {
    $doctors = Doctor::inRandomOrder()
      ->where('premium', true)
      ->where('verified', true)
      ->whereNotNull('email_verified_at')
      ->limit(4)
      ->get();


    return response()->json($doctors);
  }

  // Updates a doctor's personal information and optionally their avatar.
  public function updateInfo(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'id' => 'required',
      'phoneNumber' => 'required',
      'email' => 'required|email',
    ]);

    $this->validateWith($validator, $request);

    $data = $validator->validated();

    // Handle doctor avatar upload and store in storage/app/public/images/doctors.
    if ($request->file('avatar_doctor')) {
      $image = $request->file('avatar_doctor');
      $path = $image->store('public/images/doctors');
      $imageName = basename($path);
      $doctor_img = Doctor::find($data['id']);
      $doctor_img->avatar_doctor = $imageName;
      $doctor_img->save();
    }

    $doctor = Doctor::find($data['id']);
    $doctor->firstname = $request->post('firstname');
    $doctor->lastname = $request->post('lastname');
    $doctor->cin = $request->post('cin');
    $doctor->phoneNumber = $request->post('phoneNumber');
    $doctor->email = $request->post('email');
    $doctor->Matricule = $request->post('Matricule');
    $doctor->specialite = $request->post('specialite');
    $doctor->nom_cabinet = $request->post('nom_cabinet');
    $doctor->address_cabinet = $request->post('address_cabinet');
    $doctor->available = $request->post('available');
    $doctor->about = $request->post('about');

    $doctor->save();


    return response([
      'updated' => 'success',
      'doctor' => $doctor
    ], 200);
  }

  // Updates a doctor's working days and hours (schedule).
  public function UpdateInfoTimeWork(Request $request)
  {

    $doctor = Doctor::find($request->post('id'));
    $doctor->day_debut_work = $request->post('day_debut_work');
    $doctor->day_fin_work = $request->post('day_fin_work');
    $doctor->time_debut_work = $request->post('time_debut_work');
    $doctor->time_fin_work = $request->post('time_fin_work');
    $doctor->appointment_time = $request->post('appointment_time');

    $doctor->save();

    return response([
      'updated' => 'success',
      'doctor' => $doctor
    ], 200);
  }

  // Returns a single doctor's basic info by ID.
  public function DoctoroInfo($id)
  {

    $doctor = Doctor::find($id);
    return response([
      $doctor
    ], 200);
  }

  // Returns time slots already booked for a given doctor and date.
  public function GetTimeSpiceficDate(Request $request)
  {
      $idDoctor = $request->post("id");
      $dateAppointment = $request->post("dateApointment");

      $reservedTime = Appointment::where('doctor_id', $idDoctor)
        ->where('date_appointment', $dateAppointment)
        ->where('cancel_appointment', false)
        ->pluck('time_appointment');

      return response()->json($reservedTime);
  }

  // Returns a single doctor's public profile with aggregated review data.
  // Only returns the doctor if they are admin-verified AND email-verified.
  public function show($id)
  {

    $doctor = Doctor::where('verified', true)
      ->whereNotNull('email_verified_at')
      ->withAvg('reviews', 'rating')->withCount('reviews')->find($id);
    return response(
      $doctor
    );
  }

  // Returns all gallery images for a given doctor.
  // Only returns data if the doctor is admin-verified AND email-verified.
  public function gallery($id)
  {
    $doctor = Doctor::where('id', $id)
      ->where('verified', true)
      ->whereNotNull('email_verified_at')
      ->exists();

    if (!$doctor) {
      return response()->json([]);
    }

    $images = DoctorImage::where('doctor_id', $id)->get();
    return response()->json($images);
  }

  // Uploads a new gallery image for a doctor (auth-guarded).
  public function uploadGallery(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'doctor_id' => 'required|exists:doctors,id',
      'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
    ]);

    $this->validateWith($validator, $request);
    $data = $validator->validated();

    $image = $request->file('image');
    $path = $image->store('public/images/doctors/gallery');
    $imageName = basename($path);

    $doctorImage = DoctorImage::create([
      'doctor_id' => $data['doctor_id'],
      'image_path' => $imageName,
    ]);

    return response([
      'uploaded' => 'success',
      'image' => $doctorImage,
    ], 200);
  }

  // Deletes a gallery image by its ID.
  public function deleteGalleryImage($imageId)
  {
    $image = DoctorImage::findOrFail($imageId);
    $image->delete();

    return response([
      'deleted' => 'success',
    ], 200);
  }

  // Returns all reviews for a doctor, including user firstname/lastname, ordered newest first.
  // Only returns data if the doctor is admin-verified AND email-verified.
  public function getDoctorReviews($id)
  {
    $doctor = Doctor::where('id', $id)
      ->where('verified', true)
      ->whereNotNull('email_verified_at')
      ->exists();

    if (!$doctor) {
      return response()->json([]);
    }

    $reviews = Review::where('doctor_id', $id)
      ->with('user:id,firstname,lastname')
      ->orderBy('created_at', 'desc')
      ->get();

    return response()->json($reviews);
  }

  // Submits or updates a review. Uses upsert logic: one review per user per doctor.
  public function submitReview(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'doctor_id' => 'required|exists:doctors,id',
      'rating' => 'required|integer|min:1|max:5',
      'comment' => 'nullable|string|max:1000',
    ]);

    $this->validateWith($validator, $request);
    $data = $validator->validated();
    $userId = $request->user()->id;

    // Check if user already reviewed this doctor — if so, update instead of creating.
    $existing = Review::where('doctor_id', $data['doctor_id'])
      ->where('user_id', $userId)
      ->first();

    if ($existing) {
      $existing->update([
        'rating' => $data['rating'],
        'comment' => $data['comment'] ?? $existing->comment,
      ]);

      return response([
        'updated' => 'success',
        'review' => $existing,
      ], 200);
    }

    $review = Review::create([
      'doctor_id' => $data['doctor_id'],
      'user_id' => $userId,
      'rating' => $data['rating'],
      'comment' => $data['comment'] ?? null,
    ]);

    return response([
      'created' => 'success',
      'review' => $review,
    ], 200);
  }

}
