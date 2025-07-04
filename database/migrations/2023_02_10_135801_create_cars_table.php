<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

return new class extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        $CarsInit = file_get_contents(storage_path('app/databases/cars.fixed.latest.sql'));

        ini_set('memory_limit', '1G');
        DB::unprepared($CarsInit);
        //Schema::rename('car_db', 'cars');

        # Create Slug
        // self::fixTableStructure();

        Schema::table('cars', function (Blueprint $table) {
            //$table->fullText(['make', 'model', 'series', 'trim']);
        });
    }

    public static function fixTableStructure(): void
    {
        Schema::table('cars', function (Blueprint $table) {
            $table->integer('year_from')->nullable()->change();
            $table->integer('year_to')->nullable()->change();
            $table->string('make_slug')->after('make');
            $table->string('model_slug')->after('model');
            $table->string('series_slug')->after('series');
            $table->string('trim_slug')->after('trim');
            $table->string('generation_slug')->after('generation');
        });

        DB::table('cars')->get()->each(function ($car) {
            $make_slug = Str::slug($car->make, '_');
            $model_slug = Str::slug($car->model, '_');
            $series_slug = Str::slug($car->series, '_');
            $trim_slug = Str::slug($car->trim, '_');
            $generation_slug = Str::slug($car->generation, '_');

            DB::table('cars')
                ->where('id_trim', $car->id_trim)
                ->update([
                        'make_slug'       => $make_slug,
                        'model_slug'      => $model_slug,
                        'series_slug'     => $series_slug,
                        'trim_slug'       => $trim_slug,
                        'generation_slug' => $generation_slug,
                    ]
                );
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }

};
