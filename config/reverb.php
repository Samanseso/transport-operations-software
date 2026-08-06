<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Reverb Server
    |--------------------------------------------------------------------------
    |
    | This option controls the default server used by Reverb to handle
    | incoming messages as well as broadcasting message to all your
    | connected clients. At this time only "reverb" is supported.
    |
    */

    'default' => env('REVERB_SERVER', 'reverb'),

    /*
    |--------------------------------------------------------------------------
    | Reverb Servers
    |--------------------------------------------------------------------------
    |
    | Here you may define details for each of the supported Reverb servers.
    | Each server has its own configuration options that are defined in
    | the array below. You should ensure all the options are present.
    |
    */

    'servers' => [

        'reverb' => [
            'host' => '0.0.0.0',
            'port' => env('REVERB_SERVER_PORT', env('REVERB_PORT', 6001)),
            'path' => '',
            'hostname' => env('REVERB_HOST'),

            'options' => [
                'tls' => [],
            ],

            'max_request_size' => 10000,

            'scaling' => [
                'enabled' => false,
            ],

            'pulse_ingest_interval' => 15,
            'telescope_ingest_interval' => 15,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Reverb Applications
    |--------------------------------------------------------------------------
    |
    | Here you may define how Reverb applications are managed. If you choose
    | to use the "config" provider, you may define an array of apps which
    | your server will support, including their connection credentials.
    |
    */


    'apps' => [

        'provider' => 'config',

        'apps' => [
            [
                'key' => env('REVERB_APP_KEY'),
                'secret' => env('REVERB_APP_SECRET'),
                'app_id' => env('REVERB_APP_ID'),

                'options' => [
                    'host' => env('REVERB_HOST'),
                    'port' => env('REVERB_PORT'),
                    'scheme' => env('REVERB_SCHEME', 'http'),
                    'useTLS' => env('REVERB_SCHEME') === 'https',
                ],

                'allowed_origins' => ['*'],
                'ping_interval' => 60,
                'activity_timeout' => 30,
                'max_connections' => null,
                'max_message_size' => 10000,
            ],
        ],

    ],

];
