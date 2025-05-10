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
        Schema::table('tokens', function (Blueprint $table) {
            $table->string('device', 1024)->after('token')->nullable();
            $table->string('ip', 128)->after('device')->nullable();
            $table->dateTime('last_used_at')->after('ip')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tokens', function (Blueprint $table) {
            $table->dropColumn('device');
            $table->dropColumn('ip');
            $table->dropColumn('last_used_at');
        });
    }
};
