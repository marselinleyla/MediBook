<?php

/**
 * TestCase
 *
 * Base test class for all feature and unit tests.
 * Extends Laravel's BaseTestCase and uses CreatesApplication trait
 * to bootstrap the application for testing.
 */

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;
}
