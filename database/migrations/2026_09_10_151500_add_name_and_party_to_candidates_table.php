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
        if (!Schema::hasTable('candidates')) {
            return;
        }

        Schema::table('candidates', function (Blueprint $table) {
            if (!Schema::hasColumn('candidates', 'name')) {
                $table->string('name')->nullable()->after('id');
            }

            if (!Schema::hasColumn('candidates', 'party')) {
                $table->string('party')->nullable()->after('name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('candidates')) {
            return;
        }

        Schema::table('candidates', function (Blueprint $table) {
            if (Schema::hasColumn('candidates', 'party')) {
                $table->dropColumn('party');
            }

            if (Schema::hasColumn('candidates', 'name')) {
                $table->dropColumn('name');
            }
        });
    }
};
