<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ——— APPLICANTS ———
        Schema::table('applicants', function (Blueprint $table) {
            // unique constraints (prevent duplicate registrations)
            $table->unique('email');
            $table->unique('no_hp');

            // performance indexes
            $table->index('status');
            $table->index('created_at');
            $table->index('payment_allowed_at');
        });

        // ——— PAYMENTS ———
        Schema::table('payments', function (Blueprint $table) {
            $table->index('status');
        });

        // ——— BLOGS ———
        Schema::table('blogs', function (Blueprint $table) {
            $table->index('kategori');
        });

        // ——— GALLERIES ———
        Schema::table('galleries', function (Blueprint $table) {
            $table->index('kategori');
        });
    }

    public function down(): void
    {
        Schema::table('applicants', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['payment_allowed_at']);
            // Drop unique constraints by index name
            $table->dropUnique('applicants_email_unique');
            $table->dropUnique('applicants_no_hp_unique');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('blogs', function (Blueprint $table) {
            $table->dropIndex(['kategori']);
        });

        Schema::table('galleries', function (Blueprint $table) {
            $table->dropIndex(['kategori']);
        });
    }
};
