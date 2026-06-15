<?php

/**
 * TrustHosts Middleware
 *
 * Configures which hosts the application trusts.
 * By default, trusts all subdomains of the application URL.
 * Helps protect against host header injection attacks.
 */

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustHosts as Middleware;

class TrustHosts extends Middleware
{
    /**
     * Get the host patterns that should be trusted.
     *
     * @return array<int, string|null>
     */
    public function hosts(): array
    {
        return [
            $this->allSubdomainsOfApplicationUrl(),
        ];
    }
}
