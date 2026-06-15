<?php

/**
 * Create Reviews Table
 *
 * Stores patient reviews/ratings for doctors.
 * Each review belongs to a doctor and a user with a unique constraint
 * ensuring one review per user per doctor. Columns: rating (0-255),
 * comment (nullable text), and timestamps.
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('reviews', function (Blueprint $table) {
      $table->id();
      $table->foreignId('doctor_id')->constrained()->cascadeOnDelete();
      $table->foreignId('user_id')->constrained()->cascadeOnDelete();
      $table->unsignedTinyInteger('rating');
      $table->text('comment')->nullable();
      $table->timestamps();

      $table->unique(['doctor_id', 'user_id']);
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('reviews');
  }
};
