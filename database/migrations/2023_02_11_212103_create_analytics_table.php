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
        Schema::create('analytics', function ( Blueprint $table ) {
            $table->id();
            $table->morphs('item');
            $table->unsignedBigInteger('hits')->default(0);
            $table->string('ip', 45);
            $table->tinyInteger('device')->default(0); // 0 Desktop | 1 Mobile ....
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
        Schema::dropIfExists('analytics');
    }
};
