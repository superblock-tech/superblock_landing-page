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
            $table->text('system_wallet')->nullable();
            $table->unsignedBigInteger('system_wallet_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presale_transactions', function (Blueprint $table) {
            $table->dropColumn('system_wallet');
            $table->dropColumn('system_wallet_id');
        });
    }
};
