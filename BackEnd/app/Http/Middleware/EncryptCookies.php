<?php

/**
 * EncryptCookies Middleware
 *
 * Extends Laravel's cookie encryption middleware.
 * Allows specifying which cookies should NOT be encrypted during transmission.
 * Currently no cookies are excluded from encryption.
 */

namespace App\Http\Middleware;

use Illuminate\Cookie\Middleware\EncryptCookies as Middleware;

class EncryptCookies extends Middleware
{
    /**
     * The names of the cookies that should not be encrypted.
     *
     * @var array<int, string>
     */
    protected $except = [
        //
    ];
}
