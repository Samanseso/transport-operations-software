<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\ColumnDefinition;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $this->createUsersTable();
        $this->createPasswordResetTokensTable();
        $this->createSessionsTable();
        $this->createJobsTable();
        $this->createJobBatchesTable();
        $this->createFailedJobsTable();
        $this->createCustomersTable();
        $this->createDriversTable();
        $this->createVehiclesTable();
        $this->createPricingTable();
        $this->createReservationsTable();
        $this->createDispatchesTable();
        $this->createPaymentsTable();
        $this->createLogsTable();
        $this->createAnnouncementsTable();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('logs');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('dispatches');
        Schema::dropIfExists('reservations');
        Schema::dropIfExists('pricing');
        Schema::dropIfExists('vehicles');
        Schema::dropIfExists('drivers');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('failed_jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }

    private function createUsersTable(): void
    {
        if (Schema::hasTable('users')) {
            return;
        }

        Schema::create('users', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('role', 50)->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('remember_token', 100)->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
    }

    private function createPasswordResetTokensTable(): void
    {
        if (Schema::hasTable('password_reset_tokens')) {
            return;
        }

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });
    }

    private function createSessionsTable(): void
    {
        if (Schema::hasTable('sessions')) {
            return;
        }

        Schema::create('sessions', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->string('id')->primary();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    private function createJobsTable(): void
    {
        if (Schema::hasTable('jobs')) {
            return;
        }

        Schema::create('jobs', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->id();
            $table->string('queue')->index();
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
        });
    }

    private function createJobBatchesTable(): void
    {
        if (Schema::hasTable('job_batches')) {
            return;
        }

        Schema::create('job_batches', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->string('id')->primary();
            $table->string('name');
            $table->integer('total_jobs');
            $table->integer('pending_jobs');
            $table->integer('failed_jobs');
            $table->longText('failed_job_ids');
            $table->mediumText('options')->nullable();
            $table->integer('cancelled_at')->nullable();
            $table->integer('created_at');
            $table->integer('finished_at')->nullable();
        });
    }

    private function createFailedJobsTable(): void
    {
        if (Schema::hasTable('failed_jobs')) {
            return;
        }

        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->id();
            $table->string('uuid')->unique();
            $table->text('connection');
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
        });
    }

    private function createCustomersTable(): void
    {
        if (Schema::hasTable('customers')) {
            return;
        }

        Schema::create('customers', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->string('customer_id')->primary();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('contact_number', 150);
            $table->string('created_at', 50);

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    private function createDriversTable(): void
    {
        if (Schema::hasTable('drivers')) {
            return;
        }

        Schema::create('drivers', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->string('driver_id', 20)->primary();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('license_number', 50)->nullable();
            $table->string('status', 20)->default('Active');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    private function createVehiclesTable(): void
    {
        if (Schema::hasTable('vehicles')) {
            return;
        }

        Schema::create('vehicles', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->string('vehicle_id', 20)->primary();
            $table->string('driver_id', 50);
            $table->string('plate_number', 20);
            $table->string('model', 100);
            $table->string('capacity', 50)->nullable();
            $table->string('status', 20)->default('Available');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
    }

    private function createPricingTable(): void
    {
        if (Schema::hasTable('pricing')) {
            return;
        }

        Schema::create('pricing', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->string('pricing_id', 20)->primary();
            $table->string('service_type', 100);
            $table->string('base_rate', 10);
            $table->string('distance_rate', 10);
            $table->string('travel_time_rate', 10);
        });
    }

    private function createReservationsTable(): void
    {
        if (Schema::hasTable('reservations')) {
            return;
        }

        Schema::create('reservations', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->string('reservation_id')->primary();
            $table->string('customer_id')->nullable()->index();
            $table->string('customer_name', 100)->nullable();
            $table->string('email')->nullable();
            $table->string('contact')->nullable();
            $table->string('status', 50)->nullable()->default('PENDING');
            $table->string('pickup_address');
            $table->string('pickup_latlng', 100);
            $table->string('dropoff_address');
            $table->string('dropoff_latlng', 100);
            $table->string('date', 20);
            $table->string('time', 20);
            $table->string('service_type', 50);
            $table->string('cargo_details')->nullable();
            $table->string('special_instructions')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
    }

    private function createDispatchesTable(): void
    {
        if (Schema::hasTable('dispatches')) {
            return;
        }

        Schema::create('dispatches', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->string('reservation_id')->primary();
            $table->string('status', 50)->nullable();
            $table->string('vehicle_id', 20);
            $table->string('schedule', 20)->nullable();
            $table->string('assigned_at', 20)->nullable();
            $table->string('delivered_at', 20)->nullable();
        });
    }

    private function createPaymentsTable(): void
    {
        if (Schema::hasTable('payments')) {
            return;
        }

        Schema::create('payments', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->string('reservation_id', 20)->primary();
            $table->string('distance', 20);
            $table->string('travel_time', 20);
            $table->string('total_amount', 20);
            $table->string('payment_method', 50);
            $table->string('reference_number', 50);
            $table->string('paid_at', 20);
        });
    }

    private function createLogsTable(): void
    {
        if (Schema::hasTable('logs')) {
            return;
        }

        Schema::create('logs', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->id();
            $table->string('datelog', 50);
            $table->string('timelog', 50);
            $table->string('action', 50)->nullable();
            $table->string('module', 50)->nullable();
            $table->string('performed_to', 50)->nullable();
            $table->string('description');
        });
    }

    private function createAnnouncementsTable(): void
    {
        if (Schema::hasTable('announcements')) {
            return;
        }

        Schema::create('announcements', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->char('announcement_id', 36)->primary();
            $table->string('title');
            $table->string('summary', 500);
            $table->longText('description');
            $table->dateTime('starts_at');
            $table->dateTime('ends_at')->nullable();
            $table->string('type', 50)->default('GENERAL');
            $table->string('audience', 50)->default('ALL');
            $table->string('status', 50)->default('DRAFT');
            $table->unsignedInteger('capacity')->nullable();
            $table->string('registration_link')->nullable();
            $table->string('contact_name')->nullable();
            $table->string('contact_email')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrent()->useCurrentOnUpdate();

            $table->index(['status', 'starts_at']);
            $table->index(['audience', 'status']);
            $table->index('is_featured');
        });
    }
};
