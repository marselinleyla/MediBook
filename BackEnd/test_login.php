<?php
// Utility script — resets doctor passwords for testing purposes.
// Boots Laravel outside HTTP context, then updates specific doctor records.

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Reset password for a specific doctor by email.
$emailToReset = 'marselinleyla@gmail.com';
$doctor = App\Models\Doctor::where('email', $emailToReset)->first();
if ($doctor) {
    $doctor->password = bcrypt('password123');
    $doctor->save();
    echo "Password for $emailToReset has been reset to 'password123'.\n";
} else {
    echo "Doctor $emailToReset not found.\n";
}

// Reset password for the first doctor in the database.
$firstDoctor = App\Models\Doctor::find(1);
if ($firstDoctor) {
    $firstDoctor->password = bcrypt('password123');
    $firstDoctor->save();
    echo "Password for {$firstDoctor->email} has been reset to 'password123'.\n";
}
