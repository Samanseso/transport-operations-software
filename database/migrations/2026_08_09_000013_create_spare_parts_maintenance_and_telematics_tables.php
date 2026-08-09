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
        if (! Schema::hasTable('spare_parts')) {
            Schema::create('spare_parts', function (Blueprint $table) {
                $table->id();
                $table->string('sku')->unique();
                $table->string('name');
                $table->string('category')->default('Tires & Brakes');
                $table->integer('stock_quantity')->default(50);
                $table->integer('min_threshold')->default(10);
                $table->integer('unit_cost_cents')->default(250000);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('maintenance_logs')) {
            Schema::create('maintenance_logs', function (Blueprint $table) {
                $table->id();
                $table->string('vehicle_id')->index();
                $table->enum('service_type', ['SCHEDULED_PM', 'REPAIR', 'EMERGENCY'])->default('SCHEDULED_PM');
                $table->timestamp('serviced_at');
                $table->integer('odometer_km')->default(0);
                $table->json('parts_used')->nullable();
                $table->integer('total_cost_cents')->default(0);
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('telematics_logs')) {
            Schema::create('telematics_logs', function (Blueprint $table) {
                $table->id();
                $table->string('vehicle_id')->index();
                $table->decimal('fuel_rate_l_100km', 5, 2)->default(12.50);
                $table->integer('engine_temp_c')->default(90);
                $table->integer('idle_seconds')->default(120);
                $table->integer('harsh_braking_events')->default(0);
                $table->json('dtc_fault_codes')->nullable();
                $table->timestamp('recorded_at');
                $table->timestamps();
            });
        }

        if (\Illuminate\Support\Facades\DB::table('spare_parts')->count() === 0) {
            \Illuminate\Support\Facades\DB::table('spare_parts')->insert([
                ['sku' => 'PART-TIRE-01', 'name' => '17.5 Commercial Heavy Truck Tire', 'category' => 'Tires', 'stock_quantity' => 24, 'min_threshold' => 8, 'unit_cost_cents' => 850000, 'created_at' => now(), 'updated_at' => now()],
                ['sku' => 'PART-OIL-02', 'name' => 'Synthetic Diesel Engine Oil 15W-40 (5L)', 'category' => 'Fluids', 'stock_quantity' => 60, 'min_threshold' => 15, 'unit_cost_cents' => 180000, 'created_at' => now(), 'updated_at' => now()],
                ['sku' => 'PART-PAD-03', 'name' => 'Heavy-Duty Ceramic Brake Pad Set', 'category' => 'Brakes', 'stock_quantity' => 18, 'min_threshold' => 5, 'unit_cost_cents' => 350000, 'created_at' => now(), 'updated_at' => now()],
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('telematics_logs');
        Schema::dropIfExists('maintenance_logs');
        Schema::dropIfExists('spare_parts');
    }
};
