<?php

/**
 * ExampleTest (Unit)
 *
 * Basic unit test that asserts true is true.
 * Uses PHPUnit directly (no Laravel bootstrap needed for pure unit tests).
 */

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_that_true_is_true(): void
    {
        $this->assertTrue(true);
    }
}
