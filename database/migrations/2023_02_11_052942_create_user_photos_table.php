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
        Schema::create('user_photos', function(Blueprint $table) {
            $table->text('filename');
            $table->unsignedBigInteger('album_id')->nullable();
            $table->unsignedBigInteger('user_id')->primary();
            $table->boolean('is_profile')->default(FALSE);
            $table->boolean('is_cover')->default(FALSE);
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
        Schema::dropIfExists('user_photos');
    }
};
