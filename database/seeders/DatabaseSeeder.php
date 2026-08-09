<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        $this->call([
            UsersSeeder::class,
            DriversSeeder::class,
            CustomersSeeder::class,
            VehiclesSeeder::class,
            PricingSeeder::class,
            ReservationsSeeder::class,
            DispatchesSeeder::class,
            PaymentsSeeder::class,
            LogsSeeder::class,
            ApiSeeder::class,
            CacheSeeder::class,
            MigrationsSeeder::class,
            SessionsSeeder::class,
        ]);
    }
}
