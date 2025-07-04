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
        Schema::create('photos', function (Blueprint $table) {
            $table->id();

            $table->string('filename');
            $table->unsignedBigInteger('album_id')->nullable();


            $table->unsignedBigInteger('item_id')->nullable();
            $table->string('item_type')->nullable();

            # Used to identify the primary & cover photo
            $table->tinyInteger('is_primary')->nullable();
            $table->tinyInteger('is_cover')->nullable();

            $table->boolean('published')->default(true);

            $table->unique(['item_id', 'item_type', 'is_primary']);
            $table->unique(['item_id', 'item_type', 'is_cover']);

            $table->tinyInteger('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photos');
    }
};
