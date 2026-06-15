<?php

/**
 * Create Doctor Images Table
 *
 * Stores images associated with doctor profiles (e.g., clinic photos, diplomas).
 * Each image is linked to a doctor via foreign key with cascade delete.
 * Columns: doctor_id (FK), image_path (file path or URL).
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('doctor_images', function (Blueprint $table) {
      $table->id();
      $table->foreignId('doctor_id')->constrained()->cascadeOnDelete();
      $table->string('image_path');
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('doctor_images');
  }
};
