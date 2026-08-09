<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Populates the customers table with initial data.
     */
    public function run()
    {
        $rows = [
            [
                'customer_id' => 'CUST-1001',
                'user_id' => 7,
                'contact_number' => '09123456789',
                'created_at' => '2025-09-24 13:18:32'
            ],
            [
                'customer_id' => 'CUST-1002',
                'user_id' => 8,
                'contact_number' => '09123456789',
                'created_at' => '2025-10-16 18:12:14'
            ],
        ];

        foreach ($rows as $row) {
            DB::table('customers')->updateOrInsert(
                ['customer_id' => $row['customer_id']],
                [
                    'user_id' => $row['user_id'],
                    'contact_number' => $row['contact_number'],
                    'created_at' => $row['created_at'],
                ]
            );
        }
    }
}
