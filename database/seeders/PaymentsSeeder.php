<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Populates the payments table with initial data.
     */
    public function run()
    {
        $rows = [

        ];

        foreach ($rows as $row) {
            DB::table('payments')->updateOrInsert(
                ['reservation_id' => $row['reservation_id']],
                [
                    'distance' => $row['distance'],
                    'travel_time' => $row['travel_time'],
                    'total_amount' => $row['total_amount'],
                    'payment_method' => $row['payment_method'],
                    'reference_number' => $row['reference_number'],
                    'paid_at' => $row['paid_at'],
                ]
            );
        }
    }
}
