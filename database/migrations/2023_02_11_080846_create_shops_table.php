<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnUpdate();

            $table->string('title');
            $table->text('description');

            $table->tinyInteger('is_physical')->default(1);

            $table->foreignId('predefined_location')->nullable()
                ->constrained()
                ->cascadeOnUpdate();
            $table->string('region', 4)->nullable();
            $table->decimal('min_price', 10)->nullable();
            $table->decimal('max_price', 10)->nullable();

            $table->time('opening_hour')->nullable();
            $table->time('closing_hour')->nullable();
            $table->json('opening_days')->nullable();

            $table->tinyInteger('is_open')->default(1);

            $table->boolean('is_published')->default(true);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_approved')->default(false);

            $table->date('established_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('shops');
    }

};
