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
        Schema::table('contact_forms', function (Blueprint $table) {
            $table->string('investment_interest')->nullable();
            $table->string('country')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contact_forms', function (Blueprint $table) {
            $table->dropColumn('investment_interest');
            $table->dropColumn('country');
        });
    }
};
