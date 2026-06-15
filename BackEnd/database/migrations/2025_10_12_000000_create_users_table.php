<?php

/**
 * Create Users Table
 *
 * Stores registered patients (clients) of the MediBook platform.
 * Columns: firstname, lastname, cin (unique ID), email (nullable, unique),
 * type (default 'client'), avatar, phoneNumber, email_verified_at, password.
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
    Schema::create('users', function (Blueprint $table) {
      $table->id();
      $table->string('firstname');
      $table->string('lastname');
      $table->string('cin');
      $table->string('email')->unique()->nullable();
      $table->string('type')->default('client');
      $table->string('user_avatar')->nullable();
      $table->string('phoneNumber')->nullable();
      $table->timestamp('email_verified_at')->nullable();
      $table->string('password');
      $table->rememberToken();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('users');
  }
};
