<?php

/**
 * Authenticate Middleware
 *
 * Extends Laravel's built-in authentication middleware.
 * Redirects unauthenticated users to the login route for web requests,
 * or returns null for JSON/API requests (no redirect).
 */

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        return $request->expectsJson() ? null : route('login');
    }
}
