<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('maintenance_logs', function (Blueprint $table) {
            if (! Schema::hasColumn('maintenance_logs', 'serviced_at')) {
                $table->timestamp('serviced_at')->nullable()->after('service_type');
            }
            if (! Schema::hasColumn('maintenance_logs', 'odometer_km')) {
                $table->integer('odometer_km')->default(0)->after('serviced_at');
            }
            if (! Schema::hasColumn('maintenance_logs', 'total_cost_cents')) {
                $table->integer('total_cost_cents')->default(0)->after('odometer_km');
            }
            if (! Schema::hasColumn('maintenance_logs', 'parts_used')) {
                $table->json('parts_used')->nullable()->after('total_cost_cents');
            }
        });

        DB::table('maintenance_logs')
            ->whereNull('serviced_at')
            ->update(['serviced_at' => DB::raw('COALESCE(created_at, NOW())')]);
    }

    public function down(): void
    {
        Schema::table('maintenance_logs', function (Blueprint $table) {
            if (Schema::hasColumn('maintenance_logs', 'parts_used')) {
                $table->dropColumn('parts_used');
            }
            if (Schema::hasColumn('maintenance_logs', 'total_cost_cents')) {
                $table->dropColumn('total_cost_cents');
            }
            if (Schema::hasColumn('maintenance_logs', 'odometer_km')) {
                $table->dropColumn('odometer_km');
            }
            if (Schema::hasColumn('maintenance_logs', 'serviced_at')) {
                $table->dropColumn('serviced_at');
            }
        });
    }
};
