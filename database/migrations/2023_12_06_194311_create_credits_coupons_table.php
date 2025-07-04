<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('credits_coupons', function (Blueprint $table) {
            $table->id();

            $table->foreignId('redeemed_by')
                ->nullable()
                ->references('id')
                ->on('users')
                ->constrained();

            $table->string('code', 14)->unique();

            $table->bigInteger('amount')->nullable();

            // todo make it enum
            $table->tinyInteger('plan')->nullable();

            $table->boolean('is_redeemed')->default(false);
            $table->boolean('is_paid')->default(false);
            $table->string('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credits_coupons');
    }
};
