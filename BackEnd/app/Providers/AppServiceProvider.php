<?php

/**
 * AppServiceProvider
 *
 * The core service provider for the application.
 * register() is for binding services into the container.
 * boot() runs after all providers are registered.
 * Both are empty — no custom services or bootstrapping are needed yet.
 */

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
