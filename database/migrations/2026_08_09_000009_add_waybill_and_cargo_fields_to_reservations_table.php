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
                if (! Schema::hasColumn('reservations', 'waybill_number')) {
                    $table->string('waybill_number')->nullable()->unique()->index()->after('reservation_id');
                }
                if (! Schema::hasColumn('reservations', 'cargo_type')) {
                    $table->string('cargo_type')->default('General Freight')->after('cargo_details');
                }
                if (! Schema::hasColumn('reservations', 'cargo_weight_kg')) {
                    $table->integer('cargo_weight_kg')->default(0)->after('cargo_type');
                }
                if (! Schema::hasColumn('reservations', 'max_capacity_kg')) {
                    $table->integer('max_capacity_kg')->default(1500)->after('cargo_weight_kg');
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
                if (Schema::hasColumn('reservations', 'waybill_number')) {
                    $columnsToDrop[] = 'waybill_number';
                }
                if (Schema::hasColumn('reservations', 'cargo_type')) {
                    $columnsToDrop[] = 'cargo_type';
                }
                if (Schema::hasColumn('reservations', 'cargo_weight_kg')) {
                    $columnsToDrop[] = 'cargo_weight_kg';
                }
                if (Schema::hasColumn('reservations', 'max_capacity_kg')) {
                    $columnsToDrop[] = 'max_capacity_kg';
                }

                if (! empty($columnsToDrop)) {
                    $table->dropColumn($columnsToDrop);
                }
            });
        }
    }
};
