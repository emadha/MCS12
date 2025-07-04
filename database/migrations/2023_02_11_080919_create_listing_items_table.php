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
        if (!Schema::hasTable('listing_items')) {
            Schema::create('listing_items', function (Blueprint $table) {
                $table->id();

                $table->foreignId('user_id')->constrained()->cascadeOnUpdate();

                $table->integer('condition')
                    ->default(\App\Models\ListingItem::CONDITION_UNSPECIFIED);

                $table->unsignedBigInteger('price')->default(0);
                $table->tinyInteger('currency')->default(0);

                $table->text('description')->nullable();

                // Morphs
                $table->unsignedBigInteger('item_id')->nullable();
                $table->string('item_type')->nullable();

                $table->foreignId('shop_id')->nullable()
                    ->constrained()
                    ->cascadeOnUpdate();

                $table->boolean('is_published')->default(true);
                $table->boolean('is_approved')->default(false)->index();

                $table->foreignId('predefined_location')->nullable()
                    ->constrained()
                    ->cascadeOnUpdate();

                $table->text('keywords')->nullable();
                $table->integer('views')->default(0);

                $table->dateTime('sold_at')->nullable();
                $table->softDeletes();
                $table->timestamps();
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
        Schema::dropIfExists('listing_items');
    }

};
