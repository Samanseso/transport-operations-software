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
        if (Schema::hasTable('reservations')) {
            Schema::table('reservations', function (Blueprint $table) {
                if (! Schema::hasColumn('reservations', 'waypoints')) {
                    $table->json('waypoints')->nullable()->after('dropoff_latlng');
                }
                if (! Schema::hasColumn('reservations', 'multi_stop_surcharge_cents')) {
                    $table->integer('multi_stop_surcharge_cents')->default(0)->after('per_min_rate_applied_cents');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('reservations')) {
            Schema::table('reservations', function (Blueprint $table) {
                $columnsToDrop = [];
                if (Schema::hasColumn('reservations', 'waypoints')) {
                    $columnsToDrop[] = 'waypoints';
                }
                if (Schema::hasColumn('reservations', 'multi_stop_surcharge_cents')) {
                    $columnsToDrop[] = 'multi_stop_surcharge_cents';
                }

                if (! empty($columnsToDrop)) {
                    $table->dropColumn($columnsToDrop);
                }
            });
        }
    }
};
