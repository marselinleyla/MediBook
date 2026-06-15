<?php

/**
 * BroadcastServiceProvider
 *
 * Registers broadcasting routes and loads channel authorization definitions.
 * Currently commented out in config/app.php — broadcasting is not active.
 */

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Broadcast::routes(); // Registers /broadcasting/auth route

        require base_path('routes/channels.php'); // Channel authorization callbacks
    }
}
