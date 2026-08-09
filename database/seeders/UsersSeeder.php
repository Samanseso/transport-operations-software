<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Populates the users table with initial data.
     */
    public function run()
    {
        $rows = [
            [
                'id' => 1,
                'name' => 'Evander Wines',
                'email' => 'winesevander4@gmail.com',
                'role' => 'ADMINISTRATOR',
                'email_verified_at' => null,
                'password' => '$2y$12$gnTw27s7FXentaz/DF.mHuP9vFgsPeAu8AbTjTX8.vwTim1jqdAse',
                'remember_token' => null,
                'created_at' => '2025-11-25 18:04:19',
                'updated_at' => '2025-11-25 18:04:19',
            ],
            [
                'id' => 2,
                'name' => 'Clarisse Reyes',
                'email' => 'clarisse@fleet.driver.local',
                'role' => 'DRIVER',
                'email_verified_at' => null,
                'password' => '$2y$12$gnTw27s7FXentaz/DF.mHuP9vFgsPeAu8AbTjTX8.vwTim1jqdAse',
                'remember_token' => null,
                'created_at' => '2025-12-03 03:14:22',
                'updated_at' => '2025-12-03 03:14:22',
            ],
            [
                'id' => 3,
                'name' => 'Marco Diaz',
                'email' => 'marco@fleet.driver.local',
                'role' => 'DRIVER',
                'email_verified_at' => null,
                'password' => '$2y$12$gnTw27s7FXentaz/DF.mHuP9vFgsPeAu8AbTjTX8.vwTim1jqdAse',
                'remember_token' => null,
                'created_at' => '2025-12-03 03:14:22',
                'updated_at' => '2025-12-03 03:14:22',
            ],
            [
                'id' => 4,
                'name' => 'Miguel Cruz',
                'email' => 'miguel@fleet.driver.local',
                'role' => 'DRIVER',
                'email_verified_at' => null,
                'password' => '$2y$12$gnTw27s7FXentaz/DF.mHuP9vFgsPeAu8AbTjTX8.vwTim1jqdAse',
                'remember_token' => null,
                'created_at' => '2025-12-03 03:14:22',
                'updated_at' => '2025-12-03 03:14:22',
            ],
            [
                'id' => 5,
                'name' => 'Elena Reyes',
                'email' => 'elena@fleet.driver.local',
                'role' => 'DRIVER',
                'email_verified_at' => null,
                'password' => '$2y$12$gnTw27s7FXentaz/DF.mHuP9vFgsPeAu8AbTjTX8.vwTim1jqdAse',
                'remember_token' => null,
                'created_at' => '2025-12-03 03:14:22',
                'updated_at' => '2025-12-03 03:14:22',
            ],
            [
                'id' => 6,
                'name' => 'Peter Santos',
                'email' => 'peter@fleet.driver.local',
                'role' => 'DRIVER',
                'email_verified_at' => null,
                'password' => '$2y$12$gnTw27s7FXentaz/DF.mHuP9vFgsPeAu8AbTjTX8.vwTim1jqdAse',
                'remember_token' => null,
                'created_at' => '2025-12-03 03:14:22',
                'updated_at' => '2025-12-03 03:14:22',
            ],
            [
                'id' => 7,
                'name' => 'Evander Customer',
                'email' => 'customer1@client.local',
                'role' => 'CUSTOMER',
                'email_verified_at' => null,
                'password' => '$2y$12$gnTw27s7FXentaz/DF.mHuP9vFgsPeAu8AbTjTX8.vwTim1jqdAse',
                'remember_token' => null,
                'created_at' => '2025-12-03 03:14:22',
                'updated_at' => '2025-12-03 03:14:22',
            ],
            [
                'id' => 8,
                'name' => 'Gab Customer',
                'email' => 'customer2@client.local',
                'role' => 'CUSTOMER',
                'email_verified_at' => null,
                'password' => '$2y$12$gnTw27s7FXentaz/DF.mHuP9vFgsPeAu8AbTjTX8.vwTim1jqdAse',
                'remember_token' => null,
                'created_at' => '2025-12-03 03:14:22',
                'updated_at' => '2025-12-03 03:14:22',
            ],
            [
                'id' => 9,
                'name' => 'System Admin',
                'email' => 'admin@fleet.local',
                'role' => 'ADMINISTRATOR',
                'email_verified_at' => null,
                'password' => '$2y$12$gnTw27s7FXentaz/DF.mHuP9vFgsPeAu8AbTjTX8.vwTim1jqdAse',
                'remember_token' => null,
                'created_at' => '2026-01-21 01:56:54',
                'updated_at' => '2026-01-21 01:56:54',
            ],
        ];

        foreach ($rows as $row) {
            DB::table('users')->updateOrInsert(
                ['id' => $row['id']],
                [
                    'name' => $row['name'],
                    'email' => $row['email'],
                    'role' => $row['role'],
                    'email_verified_at' => $row['email_verified_at'],
                    'password' => $row['password'],
                    'remember_token' => $row['remember_token'],
                    'created_at' => $row['created_at'],
                    'updated_at' => $row['updated_at'],
                ]
            );
        }

        $this->syncPostgresSequence();
    }

    private function syncPostgresSequence(): void
    {
        if (DB::connection()->getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement("SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1), true)");
    }
}
