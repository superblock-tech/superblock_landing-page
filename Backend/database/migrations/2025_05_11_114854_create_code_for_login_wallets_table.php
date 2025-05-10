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
        Schema::create('code_for_login_wallets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('code_for_login_id');
            $table->string('wallet')->unique();
            $table->unsignedBigInteger('crypto_id');
            $table->unsignedBigInteger('crypto_network_id');
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('code_for_login_wallets');
    }
};
