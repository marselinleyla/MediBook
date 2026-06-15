<?php

/**
 * Third-Party Services Configuration
 *
 * Stores credentials for Mailgun, Postmark, AWS SES, and custom frontend URLs.
 * 'frontend' section defines redirect URLs for verified email links
 * pointing to the React frontend for user and doctor login pages.
 */

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'frontend' => [
        'redirect_user' => env('REDIRECT_URL_VERIFIED_EMAIL', 'http://localhost:3000/Connexion'),
        'redirect_doctor' => env('REDIRECT_URL_VERIFIED_EMAIL_DOCTOR', 'http://localhost:3000/doctor/login'),
    ],

];
