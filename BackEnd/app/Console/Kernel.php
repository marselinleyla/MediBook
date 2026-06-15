<?php

/**
 * Console Kernel
 *
 * Registers Artisan commands and schedules recurring tasks.
 * Schedule is empty — no cron tasks are configured yet.
 * Commands are auto-loaded from the app/Console/Commands directory.
 */

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('inspire')->hourly(); // Example scheduled command (disabled)
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands'); // Auto-register all commands in Commands directory

        require base_path('routes/console.php'); // Load console routes (Artisan commands)
    }
}
