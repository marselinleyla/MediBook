<?php

/**
 * TrimStrings Middleware
 *
 * Automatically trims whitespace from all incoming request string values.
 * Password and password confirmation fields are excluded from trimming
 * to avoid issues with passwords that have leading/trailing spaces.
 */

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\TrimStrings as Middleware;

class TrimStrings extends Middleware
{
    /**
     * The names of the attributes that should not be trimmed.
     *
     * @var array<int, string>
     */
    protected $except = [
        'current_password',
        'password',
        'password_confirmation',
    ];
}
