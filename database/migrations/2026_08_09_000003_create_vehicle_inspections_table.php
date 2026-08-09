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
        if (Schema::hasTable('vehicle_inspections')) {
            return;
        }

        Schema::create('vehicle_inspections', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->string('inspection_id', 36)->primary();
            $table->string('vehicle_id', 50)->index();
            $table->string('driver_id', 50)->index();
            $table->boolean('tires_ok')->default(true);
            $table->boolean('brakes_ok')->default(true);
            $table->boolean('lights_ok')->default(true);
            $table->string('fuel_level', 30)->default('Full');
            $table->integer('odometer_reading')->default(0);
            $table->text('defects_noted')->nullable();
            $table->string('photo_url')->nullable();
            $table->timestamp('inspected_at')->useCurrent();
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_inspections');
    }
};
