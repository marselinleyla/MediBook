<?php

/**
 * Create Appointments Table
 *
 * Stores appointments booked by users with doctors.
 * Columns: user_id (FK->users), doctor_id (FK->doctors),
 * date_appointment, time_appointment, type_appointment (urgent, follow-up, etc.),
 * cancel_appointment (boolean flag for cancellation).
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('appointments', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained('users', 'id');
      $table->foreignId('doctor_id')->constrained('doctors', 'id');
      $table->date('date_appointment');
      $table->string('time_appointment');
      $table->string('type_appointment');
      $table->string('cancel_appointment')->default(false);
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('appointments');
  }
};
