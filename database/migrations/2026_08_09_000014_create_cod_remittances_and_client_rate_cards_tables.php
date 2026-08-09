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
        if (! Schema::hasTable('cod_remittances')) {
            Schema::create('cod_remittances', function (Blueprint $table) {
                $table->id();
                $table->string('remittance_code')->unique();
                $table->string('driver_id')->nullable();
                $table->string('waybill_number')->index();
                $table->integer('amount_cents')->default(0);
                $table->enum('status', ['COLLECTED', 'PENDING_REMITTANCE', 'VERIFIED_BY_FINANCE'])->default('COLLECTED');
                $table->timestamp('remitted_at')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('client_rate_cards')) {
            Schema::create('client_rate_cards', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('customer_id')->index();
                $table->string('service_type')->default('Cargo / Delivery Services');
                $table->integer('base_rate_cents')->default(150000);
                $table->integer('per_km_rate_cents')->default(4500);
                $table->decimal('volume_discount_pct', 5, 2)->default(0.00);
                $table->timestamps();
            });
        }

        if (\Illuminate\Support\Facades\DB::table('cod_remittances')->count() === 0) {
            \Illuminate\Support\Facades\DB::table('cod_remittances')->insert([
                ['remittance_code' => 'COD-2026-001', 'driver_id' => 'DRIVER-01', 'waybill_number' => 'MA-2026-8X912', 'amount_cents' => 350000, 'status' => 'PENDING_REMITTANCE', 'remitted_at' => now(), 'created_at' => now(), 'updated_at' => now()],
                ['remittance_code' => 'COD-2026-002', 'driver_id' => 'DRIVER-02', 'waybill_number' => 'MA-2026-9A82F', 'amount_cents' => 185000, 'status' => 'VERIFIED_BY_FINANCE', 'remitted_at' => now()->subDay(), 'created_at' => now(), 'updated_at' => now()],
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_rate_cards');
        Schema::dropIfExists('cod_remittances');
    }
};
