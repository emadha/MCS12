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
        if (!Schema::hasTable('shop_shop_type')) {
            Schema::create('shop_shop_type', function (Blueprint $table) {
                $table->unsignedBigInteger('shop_id');
                $table->unsignedBigInteger('shop_type_id');
                $table->date('verified_at')->nullable();

                $table->primary(['shop_id', 'shop_type_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('shop_shop_type');
    }

};
