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
        Schema::table('presale_transactions', function (Blueprint $table) {
            $table->string('chain_id')->nullable();
            $table->string('chain_name')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presale_transactions', function (Blueprint $table) {
            $table->dropColumn('chain_id');
            $table->dropColumn('chain_name');
        });
    }
};
