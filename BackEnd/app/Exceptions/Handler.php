<?php

/**
 * Exception Handler
 *
 * Renders exceptions into HTTP responses and reports them to logs.
 * Prevents sensitive inputs (passwords) from being flashed to session
 * during validation exception redirects.
 */

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    // Never flash these sensitive fields to the session on validation errors
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        // Custom reporting logic can be added here (e.g., send to Slack for critical errors)
        $this->reportable(function (Throwable $e) {
            //
        });
    }
}
