<?php

/**
 * PreventRequestsDuringMaintenance Middleware
 *
 * Extends Laravel's maintenance mode middleware.
 * Allows certain URIs to remain accessible even when the application
 * is in maintenance mode. Currently no exceptions are configured.
 */

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance as Middleware;

class PreventRequestsDuringMaintenance extends Middleware
{
    /**
     * The URIs that should be reachable while maintenance mode is enabled.
     *
     * @var array<int, string>
     */
    protected $except = [
        //
    ];
}
