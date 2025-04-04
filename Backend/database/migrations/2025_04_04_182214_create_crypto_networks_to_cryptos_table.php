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
        Schema::create('crypto_networks_to_cryptos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('crypto_id');
            $table->unsignedBigInteger('network_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crypto_networks_to_cryptos');
    }
};
