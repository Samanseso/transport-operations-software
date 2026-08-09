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
        if (! Schema::hasTable('hubs')) {
            Schema::create('hubs', function (Blueprint $table) {
                $table->id();
                $table->string('hub_code')->unique();
                $table->string('name');
                $table->enum('type', ['SORTING_HUB', 'TRANSIT_HUB', 'LAST_MILE_STATION'])->default('SORTING_HUB');
                $table->string('address');
                $table->string('latlng')->nullable();
                $table->string('manager_name')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('manifests')) {
            Schema::create('manifests', function (Blueprint $table) {
                $table->id();
                $table->string('manifest_code')->unique();
                $table->foreignId('origin_hub_id')->constrained('hubs')->onDelete('cascade');
                $table->foreignId('destination_hub_id')->constrained('hubs')->onDelete('cascade');
                $table->string('vehicle_id')->nullable();
                $table->string('driver_id')->nullable();
                $table->enum('status', ['CREATED', 'IN_TRANSIT', 'ARRIVED', 'SORTED'])->default('CREATED');
                $table->json('waybills')->nullable();
                $table->timestamp('dispatched_at')->nullable();
                $table->timestamp('arrived_at')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('hub_scans')) {
            Schema::create('hub_scans', function (Blueprint $table) {
                $table->id();
                $table->string('waybill_number')->index();
                $table->foreignId('hub_id')->constrained('hubs')->onDelete('cascade');
                $table->enum('scan_type', ['INBOUND_SORT', 'OUTBOUND_LINEHAUL', 'DISPATCH_HANDOVER'])->default('INBOUND_SORT');
                $table->string('sorting_bin')->nullable();
                $table->string('scanned_by')->nullable();
                $table->timestamp('scanned_at');
                $table->timestamps();
            });
        }

        if (\Illuminate\Support\Facades\DB::table('hubs')->count() === 0) {
            \Illuminate\Support\Facades\DB::table('hubs')->insert([
                [
                    'hub_code' => 'HUB-MNL-01',
                    'name' => 'Metro Manila Central Sorting Gateway',
                    'type' => 'SORTING_HUB',
                    'address' => 'Port Area, Manila, Metro Manila',
                    'latlng' => '14.5885,120.9691',
                    'manager_name' => 'Ramon Santos',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'hub_code' => 'HUB-QC-02',
                    'name' => 'Quezon City North Transit Station',
                    'type' => 'TRANSIT_HUB',
                    'address' => 'Novaliches, Quezon City',
                    'latlng' => '14.7000,121.0333',
                    'manager_name' => 'Maria Clara',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'hub_code' => 'HUB-SOU-03',
                    'name' => 'South Luzon Last-Mile Hub',
                    'type' => 'LAST_MILE_STATION',
                    'address' => 'Calamba, Laguna',
                    'latlng' => '14.2117,121.1656',
                    'manager_name' => 'Jose Rizal',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hub_scans');
        Schema::dropIfExists('manifests');
        Schema::dropIfExists('hubs');
    }
};
