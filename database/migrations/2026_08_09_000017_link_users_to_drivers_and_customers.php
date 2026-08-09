<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add user_id FK to drivers if missing (handles pre-existing tables)
        if (Schema::hasTable('drivers') && !Schema::hasColumn('drivers', 'user_id')) {
            Schema::table('drivers', function (Blueprint $table) {
                $table->unsignedBigInteger('user_id')->nullable()->after('driver_id');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            });
        }

        // Drop redundant columns from drivers
        Schema::table('drivers', function (Blueprint $table) {
            $cols = ['name'];
            foreach ($cols as $col) {
                if (Schema::hasColumn('drivers', $col)) {
                    $table->dropColumn($col);
                }
            }
        });

        // Add user_id FK to customers if missing
        if (Schema::hasTable('customers') && !Schema::hasColumn('customers', 'user_id')) {
            Schema::table('customers', function (Blueprint $table) {
                $table->unsignedBigInteger('user_id')->nullable()->after('customer_id');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            });
        }

        // Drop redundant columns from customers
        Schema::table('customers', function (Blueprint $table) {
            $cols = ['customer_name', 'email'];
            foreach ($cols as $col) {
                if (Schema::hasColumn('customers', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }

    public function down(): void
    {
        //
    }
};
