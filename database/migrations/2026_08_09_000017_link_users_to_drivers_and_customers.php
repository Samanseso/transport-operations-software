<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add user_id to drivers if missing
        if (Schema::hasTable('drivers') && ! Schema::hasColumn('drivers', 'user_id')) {
            Schema::table('drivers', function (Blueprint $table) {
                $table->unsignedBigInteger('user_id')->nullable()->after('driver_id');
            });
        }

        // 2. Add user_id to customers if missing
        if (Schema::hasTable('customers') && ! Schema::hasColumn('customers', 'user_id')) {
            Schema::table('customers', function (Blueprint $table) {
                $table->unsignedBigInteger('user_id')->nullable()->after('customer_id');
            });
        }

        // 3. Match and link DRIVERS rows with USERS
        $drivers = DB::table('drivers')->get();
        foreach ($drivers as $driver) {
            $user = null;

            // Try matching user by role_id or name
            if (! empty($driver->driver_id)) {
                $user = DB::table('users')->where('role_id', $driver->driver_id)->first();
            }

            if (! $user && isset($driver->name)) {
                $user = DB::table('users')->where('name', $driver->name)->where('role', 'DRIVER')->first();
            }

            if (! $user) {
                // Find any unlinked driver user
                $user = DB::table('users')->where('role', 'DRIVER')->whereNull('role_id')->first();
            }

            // Create a user record if none found
            if (! $user) {
                $driverName = isset($driver->name) ? $driver->name : 'Driver ' . $driver->driver_id;
                $userId = DB::table('users')->insertGetId([
                    'name' => $driverName,
                    'email' => strtolower(str_replace(' ', '', $driver->driver_id)) . '@fleet.driver.local',
                    'password' => Hash::make('Password123!'),
                    'role' => 'DRIVER',
                    'role_id' => $driver->driver_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $userId = $user->id;
                DB::table('users')->where('id', $userId)->update(['role_id' => $driver->driver_id]);
            }

            DB::table('drivers')->where('driver_id', $driver->driver_id)->update(['user_id' => $userId]);
        }

        // Add foreign key constraint to drivers.user_id if not present
        Schema::table('drivers', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // Drop redundant name column from drivers
        if (Schema::hasColumn('drivers', 'name')) {
            Schema::table('drivers', function (Blueprint $table) {
                $table->dropColumn('name');
            });
        }

        // 4. Match and link CUSTOMERS rows with USERS
        $customers = DB::table('customers')->get();
        foreach ($customers as $customer) {
            $user = null;

            if (! empty($customer->customer_id)) {
                $user = DB::table('users')->where('role_id', $customer->customer_id)->first();
            }

            if (! $user && isset($customer->email)) {
                $user = DB::table('users')->where('email', $customer->email)->first();
            }

            if (! $user && isset($customer->customer_name)) {
                $user = DB::table('users')->where('name', $customer->customer_name)->where('role', 'CUSTOMER')->first();
            }

            if (! $user) {
                $custName = isset($customer->customer_name) ? $customer->customer_name : 'Customer ' . $customer->customer_id;
                $custEmail = isset($customer->email) && ! empty($customer->email) ? $customer->email : strtolower(str_replace(' ', '', $customer->customer_id)) . '@client.local';

                // Check if email taken
                $exists = DB::table('users')->where('email', $custEmail)->first();
                if ($exists) {
                    $custEmail = 'client_' . $customer->customer_id . '_' . rand(100, 999) . '@client.local';
                }

                $userId = DB::table('users')->insertGetId([
                    'name' => $custName,
                    'email' => $custEmail,
                    'password' => Hash::make('Password123!'),
                    'role' => 'CUSTOMER',
                    'role_id' => $customer->customer_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $userId = $user->id;
                DB::table('users')->where('id', $userId)->update(['role_id' => $customer->customer_id]);
            }

            DB::table('customers')->where('customer_id', $customer->customer_id)->update(['user_id' => $userId]);
        }

        // Add foreign key constraint to customers.user_id if not present
        Schema::table('customers', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // Drop redundant customer_name and email columns from customers
        Schema::table('customers', function (Blueprint $table) {
            if (Schema::hasColumn('customers', 'customer_name')) {
                $table->dropColumn('customer_name');
            }
            if (Schema::hasColumn('customers', 'email')) {
                $table->dropColumn('email');
            }
        });
    }

    public function down(): void
    {
        Schema::table('drivers', function (Blueprint $table) {
            if (Schema::hasColumn('drivers', 'user_id')) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            }
            $table->string('name', 100)->nullable();
        });

        Schema::table('customers', function (Blueprint $table) {
            if (Schema::hasColumn('customers', 'user_id')) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            }
            $table->string('customer_name', 150)->nullable();
            $table->string('email', 150)->nullable();
        });
    }
};
