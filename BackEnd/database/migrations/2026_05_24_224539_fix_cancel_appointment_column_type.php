<?php

/**
 * Fix Cancel Appointment Column Type
 *
 * Migration that changes the cancel_appointment column in the appointments
 * table from string to boolean. This corrects the original column type
 * for proper boolean handling in the application code.
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
        Schema::table('appointments', function (Blueprint $table) {
            $table->boolean('cancel_appointment')->default(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->string('cancel_appointment')->default('0')->change();
        });
    }
};
