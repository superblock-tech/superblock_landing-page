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
            $table->boolean('is_active')->default(false);
            $table->string('name');
            $table->string('name_next')->nullable();
            $table->string('sbx_price_next')->nullable();
            $table->float('sbx_allocated', 16, 6);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('whitelists', function (Blueprint $table) {
            $table->dropColumn('is_active');
            $table->dropColumn('name');
            $table->dropColumn('name_next');
            $table->dropColumn('sbx_price_next');
            $table->dropColumn('sbx_allocated');
        });
    }
};
