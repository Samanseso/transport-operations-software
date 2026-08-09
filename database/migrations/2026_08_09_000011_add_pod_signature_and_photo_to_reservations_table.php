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
        if (Schema::hasTable('reservations')) {
            Schema::table('reservations', function (Blueprint $table) {
                if (! Schema::hasColumn('reservations', 'pod_signature_url')) {
                    $table->longText('pod_signature_url')->nullable()->after('multi_stop_surcharge_cents');
                }
                if (! Schema::hasColumn('reservations', 'pod_photo_url')) {
                    $table->string('pod_photo_url')->nullable()->after('pod_signature_url');
                }
                if (! Schema::hasColumn('reservations', 'pod_recipient_name')) {
                    $table->string('pod_recipient_name')->nullable()->after('pod_photo_url');
                }
                if (! Schema::hasColumn('reservations', 'pod_signed_at')) {
                    $table->timestamp('pod_signed_at')->nullable()->after('pod_recipient_name');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('reservations')) {
            Schema::table('reservations', function (Blueprint $table) {
                $columnsToDrop = [];
                if (Schema::hasColumn('reservations', 'pod_signature_url')) {
                    $columnsToDrop[] = 'pod_signature_url';
                }
                if (Schema::hasColumn('reservations', 'pod_photo_url')) {
                    $columnsToDrop[] = 'pod_photo_url';
                }
                if (Schema::hasColumn('reservations', 'pod_recipient_name')) {
                    $columnsToDrop[] = 'pod_recipient_name';
                }
                if (Schema::hasColumn('reservations', 'pod_signed_at')) {
                    $columnsToDrop[] = 'pod_signed_at';
                }

                if (! empty($columnsToDrop)) {
                    $table->dropColumn($columnsToDrop);
                }
            });
        }
    }
};
