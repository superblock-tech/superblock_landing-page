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
        Schema::create('presale_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('wallet_address', 1024);
            $table->decimal('amount', 20,10)->default(0);
            $table->unsignedBigInteger('crypto_id');
            $table->decimal('usdt_amount', 20,10)->default(0);
            $table->decimal('sbx_price', 20,10)->default(0);
            $table->string('transaction_confirmation', 1024)->nullable();
            $table->string('txn_id', 512)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presale_transactions');
    }
};
