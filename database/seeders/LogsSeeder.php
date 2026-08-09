<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LogsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Populates the logs table with initial data.
     */
    public function run()
    {
        $rows = [
        ];

        foreach ($rows as $row) {
            DB::table('logs')->updateOrInsert(
                [
                    'datelog' => $row['datelog'],
                    'timelog' => $row['timelog'],
                    'action' => $row['action'],
                    'module' => $row['module'],
                    'performed_to' => $row['performed_to'],
                    'description' => $row['description'],
                ],
                []
            );
        }
    }
}
