<?php

/**
 * ValidateSignature Middleware
 *
 * Validates signed URLs to ensure they haven't been tampered with.
 * Certain query parameters (like UTM tracking params) can be ignored
 * during signature validation. Currently none are excluded.
 */

namespace App\Http\Middleware;

use Illuminate\Routing\Middleware\ValidateSignature as Middleware;

class ValidateSignature extends Middleware
{
    /**
     * The names of the query string parameters that should be ignored.
     *
     * @var array<int, string>
     */
    protected $except = [
        // 'fbclid',
        // 'utm_campaign',
        // 'utm_content',
        // 'utm_medium',
        // 'utm_source',
        // 'utm_term',
    ];
}
