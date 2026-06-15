<?php

/**
 * CreatesApplication Trait
 *
 * Bootstraps the Laravel application for testing by loading bootstrap/app.php
 * and running the console kernel's bootstrap method. Used by TestCase.
 */

namespace Tests;

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Foundation\Application;

trait CreatesApplication
{
    /**
     * Creates the application.
     */
    public function createApplication(): Application
    {
        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(Kernel::class)->bootstrap();

        return $app;
    }
}
