<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DriversSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Populates the drivers table with initial data.
     */
    public function run()
    {
        $rows = [
            [
                'driver_id' => 'DRV-1001',
                'user_id' => 2,
                'contact_number' => '0917-234-5678',
                'license_number' => 'LIC-102',
                'status' => 'NOT AVAILABLE',
                'created_at' => '2025-01-15 09:00:00',
                'updated_at' => '2025-09-23 17:56:02'
            ],
            [
                'driver_id' => 'DRV-1002',
                'user_id' => 3,
                'contact_number' => '0917-888-9999',
                'license_number' => 'LIC-103',
                'status' => 'NOT AVAILABLE',
                'created_at' => '2025-04-01 11:10:00',
                'updated_at' => '2025-09-23 17:09:28'
            ],
            [
                'driver_id' => 'DRV-1003',
                'user_id' => 4,
                'contact_number' => '0917-987-6543',
                'license_number' => 'LIC-107',
                'status' => 'NOT AVAILABLE',
                'created_at' => '2025-02-10 08:30:00',
                'updated_at' => '2025-10-18 15:52:48'
            ],
            [
                'driver_id' => 'DRV-1004',
                'user_id' => 5,
                'contact_number' => '0917-000-1234',
                'license_number' => 'LIC-108',
                'status' => 'AVAILABLE',
                'created_at' => '2025-05-20 13:20:00',
                'updated_at' => '2025-09-23 17:12:57'
            ],
            [
                'driver_id' => 'DRV-1005',
                'user_id' => 6,
                'contact_number' => '0917-333-2222',
                'license_number' => 'LIC-109',
                'status' => 'AVAILABLE',
                'created_at' => '2025-03-05 07:45:00',
                'updated_at' => '2025-03-05 07:45:00'
            ]
        ];

        foreach ($rows as $row) {
            DB::table('drivers')->updateOrInsert(
                ['driver_id' => $row['driver_id']],
                [
                    'user_id' => $row['user_id'],
                    'contact_number' => $row['contact_number'],
                    'license_number' => $row['license_number'],
                    'status' => $row['status'],
                    'created_at' => $row['created_at'],
                    'updated_at' => $row['updated_at'],
                ]
            );
        }
    }
}
