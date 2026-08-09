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
            return;
        }

        Schema::create('fuel_logs', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->string('fuel_log_id', 36)->primary();
            $table->string('vehicle_id', 50)->index();
            $table->string('driver_id', 50)->nullable()->index();
            $table->decimal('liters', 8, 2);
            $table->decimal('total_cost', 10, 2);
            $table->integer('odometer_reading');
            $table->string('receipt_image_url')->nullable();
            $table->timestamp('filled_at')->useCurrent();
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fuel_logs');
    }
};
