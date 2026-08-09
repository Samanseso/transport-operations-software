<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('reservations') && ! Schema::hasColumn('reservations', 'total_fare_cents')) {
            Schema::table('reservations', function (Blueprint $table) {
                $table->bigInteger('total_fare_cents')->default(0)->after('special_instructions');
                $table->integer('base_rate_applied_cents')->default(0)->after('total_fare_cents');
                $table->integer('per_km_rate_applied_cents')->default(0)->after('base_rate_applied_cents');
                $table->integer('per_min_rate_applied_cents')->default(0)->after('per_km_rate_applied_cents');
            });
        }

        if (Schema::hasTable('payments') && ! Schema::hasColumn('payments', 'total_amount_cents')) {
            Schema::table('payments', function (Blueprint $table) {
                $table->bigInteger('total_amount_cents')->default(0)->after('total_amount');
            });
        }

        if (Schema::hasTable('pricing') && ! Schema::hasColumn('pricing', 'base_rate_cents')) {
            Schema::table('pricing', function (Blueprint $table) {
                $table->integer('base_rate_cents')->default(0)->after('service_type');
                $table->integer('distance_rate_cents')->default(0)->after('base_rate_cents');
                $table->integer('travel_time_rate_cents')->default(0)->after('distance_rate_cents');
            });
        }

        if (Schema::hasTable('maintenance_logs') && ! Schema::hasColumn('maintenance_logs', 'cost_cents')) {
            Schema::table('maintenance_logs', function (Blueprint $table) {
                $table->bigInteger('cost_cents')->default(0)->after('cost');
            });
        }

        if (Schema::hasTable('fuel_logs') && ! Schema::hasColumn('fuel_logs', 'total_cost_cents')) {
            Schema::table('fuel_logs', function (Blueprint $table) {
                $table->bigInteger('total_cost_cents')->default(0)->after('total_cost');
            });
        }

        if (Schema::hasTable('driver_expenses') && ! Schema::hasColumn('driver_expenses', 'amount_cents')) {
            Schema::table('driver_expenses', function (Blueprint $table) {
                $table->bigInteger('amount_cents')->default(0)->after('amount');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('reservations') && Schema::hasColumn('reservations', 'total_fare_cents')) {
            Schema::table('reservations', function (Blueprint $table) {
                $table->dropColumn([
                    'total_fare_cents',
                    'base_rate_applied_cents',
                    'per_km_rate_applied_cents',
                    'per_min_rate_applied_cents',
                ]);
            });
        }

        if (Schema::hasTable('payments') && Schema::hasColumn('payments', 'total_amount_cents')) {
            Schema::table('payments', function (Blueprint $table) {
                $table->dropColumn('total_amount_cents');
            });
        }

        if (Schema::hasTable('pricing') && Schema::hasColumn('pricing', 'base_rate_cents')) {
            Schema::table('pricing', function (Blueprint $table) {
                $table->dropColumn([
                    'base_rate_cents',
                    'distance_rate_cents',
                    'travel_time_rate_cents',
                ]);
            });
        }

        if (Schema::hasTable('maintenance_logs') && Schema::hasColumn('maintenance_logs', 'cost_cents')) {
            Schema::table('maintenance_logs', function (Blueprint $table) {
                $table->dropColumn('cost_cents');
            });
        }

        if (Schema::hasTable('fuel_logs') && Schema::hasColumn('fuel_logs', 'total_cost_cents')) {
            Schema::table('fuel_logs', function (Blueprint $table) {
                $table->dropColumn('total_cost_cents');
            });
        }

        if (Schema::hasTable('driver_expenses') && Schema::hasColumn('driver_expenses', 'amount_cents')) {
            Schema::table('driver_expenses', function (Blueprint $table) {
                $table->dropColumn('amount_cents');
            });
        }
    }
};
