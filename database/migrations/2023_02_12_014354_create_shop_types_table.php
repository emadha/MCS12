<?php

use App\Models\ShopType;
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
        if (!Schema::hasTable('shop_types')) {
            Schema::create('shop_types', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->tinyInteger('type');
                $table->timestamps();
            });

            foreach (ShopType::$shopTypes as $_key => $_value) {
                ShopType::create(['title' => $_value, 'type' => $_key]);
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('shop_types');
    }
};
