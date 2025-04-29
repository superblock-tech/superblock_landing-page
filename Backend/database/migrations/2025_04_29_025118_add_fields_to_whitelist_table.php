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
        Schema::table('whitelists', function (Blueprint $table) {
            $table->dateTime('started_at')->nullable();
            $table->dateTime('finished_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('whitelists', function (Blueprint $table) {
            $table->dropColumn('started_at');
            $table->dropColumn('finished_at');
        });
    }
};
