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
        Schema::create('listing_items_cars', function ( Blueprint $table ) {
            $table->id();
            $table->foreignId('car_id');

            $table->integer('exterior_color')->nullable();
            $table->integer('interior_color')->nullable();
            $table->integer('interior_material')->nullable();

            $table->integer('odometer')->nullable();

            $table->string('make')->nullable();
            $table->string('model')->nullable();
            $table->string('trim')->nullable();
            $table->string('year')->nullable();

            $table->string('vin')->nullable();

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
        Schema::dropIfExists('listing_items_cars');
    }
};
