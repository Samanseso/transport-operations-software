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
        if (Schema::hasTable('driver_expenses')) {
            return;
        }

        Schema::create('driver_expenses', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->string('expense_id', 36)->primary();
            $table->string('driver_id', 50)->index();
            $table->string('category', 50); // Fuel, Toll, Parking, Repair, Other
            $table->decimal('amount', 10, 2);
            $table->text('description')->nullable();
            $table->string('receipt_url')->nullable();
            $table->string('status', 30)->default('PENDING'); // PENDING, APPROVED, REJECTED
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('driver_expenses');
    }
};
