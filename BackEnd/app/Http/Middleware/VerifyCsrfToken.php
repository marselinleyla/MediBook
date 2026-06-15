<?php

/**
 * VerifyCsrfToken Middleware
 *
 * Protects the application from Cross-Site Request Forgery attacks.
 * Certain URIs (e.g., webhook endpoints) can be excluded from CSRF
 * verification. Currently no URIs are excluded.
 */

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        //
    ];
}
