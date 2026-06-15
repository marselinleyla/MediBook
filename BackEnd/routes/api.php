<?php
// API route definitions — maps endpoints to controller methods for all three user types (user, doctor, admin).
// Routes are organized by auth status: authenticated (sanctum) vs. public.

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AppointmentManagementController;
use App\Http\Controllers\Auth\Admin\AdminAuthController;
use App\Http\Controllers\Auth\Doctor\DoctorAuthController;
use App\Http\Controllers\Auth\User\UserAuthController;
use App\Http\Controllers\DoctorManagementController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\UsersManagementController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Routes protected by Sanctum authentication — require a valid API token.
Route::middleware('auth:sanctum')->group(
  function () {

    // DOCTOR ROUTES (authenticated)

    Route::get('/doctor', [DoctorAuthController::class, 'doctor']);
    Route::post('/doctor/logout', [DoctorAuthController::class, 'logout']);
    Route::get('/doctor/{id}', [DoctorManagementController::class, 'DoctoroInfo']);
    Route::post('/doctor/update/info', [DoctorManagementController::class, 'updateInfo']);
    Route::post('/doctor/gallery/upload', [DoctorManagementController::class, 'uploadGallery']);
    Route::delete('/doctor/gallery/{imageId}', [DoctorManagementController::class, 'deleteGalleryImage']);
    Route::post('/appointment/cancel', [AppointmentManagementController::class, 'CancelAppointment']);

    // USER ROUTES (authenticated)

    Route::get('/user', [UserAuthController::class, 'user']);
    Route::post('/user/logout', [UserAuthController::class, 'logout']);
    Route::put('/user/update', [UsersManagementController::class, 'update']);
    Route::get('/user/appointments/{userId}', [AppointmentManagementController::class, 'GetUserAppointments']);
    Route::get('/user/appointments/cancelled/{userId}', [AppointmentManagementController::class, 'GetUserCancelledAppointments']);
    Route::post('/review/submit', [DoctorManagementController::class, 'submitReview']);

    // ADMIN ROUTES (authenticated)

    Route::get('/admin', [AdminAuthController::class, 'admin']);
    Route::post('/admin/logout', [AdminAuthController::class, 'logout']);
    Route::post('/admin/update', [AdminController::class, 'updateInfo']);
    Route::get('/admin/doctors/today', [AdminController::class, 'getDoctorsRegisteredToday']);
  }
);


// PUBLIC USER ROUTES (no authentication required)

Route::post('/contact', [ContactController::class, 'send']);
Route::post('/user/login', [UserAuthController::class, 'login']);
Route::post('/user/register', [UserAuthController::class, 'register']);
Route::delete('/user/delete', [UsersManagementController::class, 'delete']);


// PUBLIC DOCTOR ROUTES

Route::post('/doctor/login', [DoctorAuthController::class, 'login']);
Route::post('/doctor/register', [DoctorAuthController::class, 'register']);
Route::post('/doctor/update/info/time', [DoctorManagementController::class, 'UpdateInfoTimeWork']);
Route::post('/doctor/home', [DoctorManagementController::class, 'getRandomPremiumDoctors']);
Route::post('/search/doctors', [DoctorManagementController::class, 'SearchDoctors']);
Route::get('/doctor_view/{id}', [DoctorManagementController::class, 'show']);
Route::get('/doctor/gallery/{id}', [DoctorManagementController::class, 'gallery']);
Route::get('/doctor/reviews/{id}', [DoctorManagementController::class, 'getDoctorReviews']);


// PUBLIC APPOINTMENT ROUTES

Route::post('/take/appointment', [AppointmentManagementController::class, 'TakeAppointment']);
Route::get('/doctor/appointmentoldday/{doctorId}', [AppointmentManagementController::class, 'GetAppointmentOldDate']);
Route::get('/doctor/appointmenttoday/{doctorId}', [AppointmentManagementController::class, 'GetAppointmentToday']);
Route::get('/doctor/newappointment/{doctorId}', [AppointmentManagementController::class, 'GetNewAppointment']);
Route::post("/appointment/reserved", [DoctorManagementController::class, 'GetTimeSpiceficDate']);

// PUBLIC ADMIN ROUTES

Route::post("/admin/login", [AdminAuthController::class, 'login']);
Route::get('/admin/doctor', [AdminController::class, 'GetAllDocter']);
Route::get('/admin/patient', [AdminController::class, 'GetAllPatient']);
Route::post('/admin/verified', [AdminController::class, 'VerifiedDoctor']);
Route::post('/doctor/noverified', [AdminController::class, 'DoctorNoVerified']);
Route::get('/send', [AdminController::class, 'test']);

// EMAIL VERIFICATION ROUTES (users and doctors)

Route::get('email/verify/{id}', [UserAuthController::class, 'verify'])->name('verification.verify');
Route::get('email/resend/{id}',  [UserAuthController::class, 'resend'])->name('verification.resend');

Route::get('doctors/email/verify/{id}', [DoctorAuthController::class, 'verify'])->name('doctor.verification.verify');
Route::get('doctors/email/resend/{id}',  [DoctorAuthController::class, 'resend'])->name('doctor.verification.resend');


