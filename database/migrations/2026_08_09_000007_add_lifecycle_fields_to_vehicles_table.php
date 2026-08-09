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
        if (Schema::hasTable('vehicles')) {
            Schema::table('vehicles', function (Blueprint $table) {
                if (! Schema::hasColumn('vehicles', 'vin_number')) {
                    $table->string('vin_number')->nullable()->unique()->after('plate_number');
                }
                if (! Schema::hasColumn('vehicles', 'registration_expires_at')) {
                    $table->date('registration_expires_at')->nullable()->after('capacity');
                }
                if (! Schema::hasColumn('vehicles', 'insurance_expires_at')) {
                    $table->date('insurance_expires_at')->nullable()->after('registration_expires_at');
                }
                if (! Schema::hasColumn('vehicles', 'last_serviced_odometer')) {
                    $table->integer('last_serviced_odometer')->default(0)->after('insurance_expires_at');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('vehicles')) {
            Schema::table('vehicles', function (Blueprint $table) {
                $columnsToDrop = [];
                if (Schema::hasColumn('vehicles', 'vin_number')) {
                    $columnsToDrop[] = 'vin_number';
                }
                if (Schema::hasColumn('vehicles', 'registration_expires_at')) {
                    $columnsToDrop[] = 'registration_expires_at';
                }
                if (Schema::hasColumn('vehicles', 'insurance_expires_at')) {
                    $columnsToDrop[] = 'insurance_expires_at';
                }
                if (Schema::hasColumn('vehicles', 'last_serviced_odometer')) {
                    $columnsToDrop[] = 'last_serviced_odometer';
                }

                if (! empty($columnsToDrop)) {
                    $table->dropColumn($columnsToDrop);
                }
            });
        }
    }
};
