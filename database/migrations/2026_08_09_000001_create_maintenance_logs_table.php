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
        if (Schema::hasTable('maintenance_logs')) {
            return;
        }

        Schema::create('maintenance_logs', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->string('maintenance_id', 36)->primary();
            $table->string('vehicle_id', 50)->index();
            $table->string('service_type', 100);
            $table->integer('odometer_reading')->default(0);
            $table->decimal('cost', 10, 2)->default(0.00);
            $table->string('service_center', 150)->nullable();
            $table->string('status', 30)->default('SCHEDULED'); // SCHEDULED, COMPLETED, OVERDUE, CANCELLED
            $table->date('scheduled_at')->nullable();
            $table->date('completed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_logs');
    }
};
