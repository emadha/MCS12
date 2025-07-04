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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()
                ->cascadeOnDelete()->cascadeOnUpdate();

            $table->foreignId('board_id')
                ->constrained()->on('message_boards')
                ->cascadeOnDelete()->cascadeOnUpdate();

            $table->text('content')->nullable();
            $table->json('read_by')->nullable();
            $table->json('hidden_for')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
