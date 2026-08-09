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
        if (Schema::hasTable('fuel_logs')) {
            Schema::table('fuel_logs', function (Blueprint $table) {
                if (! Schema::hasColumn('fuel_logs', 'efficiency_km_l')) {
                    $table->decimal('efficiency_km_l', 8, 2)->nullable()->after('odometer_reading');
                }
                if (! Schema::hasColumn('fuel_logs', 'is_anomaly')) {
                    $table->boolean('is_anomaly')->default(false)->after('efficiency_km_l');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('fuel_logs')) {
            Schema::table('fuel_logs', function (Blueprint $table) {
                $columnsToDrop = [];
                if (Schema::hasColumn('fuel_logs', 'efficiency_km_l')) {
                    $columnsToDrop[] = 'efficiency_km_l';
                }
                if (Schema::hasColumn('fuel_logs', 'is_anomaly')) {
                    $columnsToDrop[] = 'is_anomaly';
                }

                if (! empty($columnsToDrop)) {
                    $table->dropColumn($columnsToDrop);
                }
            });
        }
    }
};
