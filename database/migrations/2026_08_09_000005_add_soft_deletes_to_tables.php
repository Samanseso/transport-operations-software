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
        if (Schema::hasTable('users') && ! Schema::hasColumn('users', 'deleted_at')) {
            Schema::table('users', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        if (Schema::hasTable('vehicles') && ! Schema::hasColumn('vehicles', 'deleted_at')) {
            Schema::table('vehicles', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        if (Schema::hasTable('drivers') && ! Schema::hasColumn('drivers', 'deleted_at')) {
            Schema::table('drivers', function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('users') && Schema::hasColumn('users', 'deleted_at')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }

        if (Schema::hasTable('vehicles') && Schema::hasColumn('vehicles', 'deleted_at')) {
            Schema::table('vehicles', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }

        if (Schema::hasTable('drivers') && Schema::hasColumn('drivers', 'deleted_at')) {
            Schema::table('drivers', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }
    }
};
