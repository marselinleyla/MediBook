<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$doctors = DB::table('doctors')->select('id','firstname','lastname','avatar_doctor')->get();
foreach ($doctors as $d) {
    echo $d->id . ' | ' . $d->firstname . ' ' . $d->lastname . ' | avatar: ' . ($d->avatar_doctor ?? 'NULL') . "\n";
}
