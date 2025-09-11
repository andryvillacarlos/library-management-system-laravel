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
        Schema::table('track_history', function (Blueprint $table) {
            $table->date('borrow_date')->nullable()->after('action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('track_history', function (Blueprint $table) {
            $table->dropColumn('borrow_date');
        });
    }
};
