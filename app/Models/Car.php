<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use stdClass;

/**
 * @property mixed $series_slug
 * @property mixed $model_slug
 * @property mixed $year_from
 * @property mixed $make
 * @property mixed $make_slug
 */
class Car extends Base
{

    use HasFactory;

    protected $hidden = ['id_trim', 'make_slug', 'model_slug', 'trim_slug', 'series_slug', 'generation_slug'];

    public $timestamps = false;

    protected $guarded = [];

    protected $attributes = ['links'];

    protected $primaryKey = 'id_trim';

    public function getLinksAttribute(): stdClass
    {
        $links = parent::getLinksAttribute();

        if ($this->make_slug) {
            $links->make = route('database.cars.make', [$this->make_slug]);
        }

//        if ($this->make_slug
//            && $this->year_from) {
//            $links->year = route('database.cars.year', [
//                $this->make_slug,
//                $this->year_from,
//            ]);
//        }
        if ($this->make_slug
            && $this->year_from
            && $this->model_slug) {
            $links->model = route('database.cars.model', [
                $this->make_slug,
                $this->year_from,
                $this->model_slug,
            ]);
        }
        if ($this->make_slug
            && $this->year_from
            && $this->model_slug
            && $this->series_slug) {
            $links->series = route('database.cars.series', [
                $this->make_slug,
                $this->year_from,
                $this->model_slug,
                $this->series_slug,
            ]);
        }
        if ($this->make_slug
            && $this->year_from
            && $this->model_slug
            && $this->series_slug
            && $this->trim_slug) {
            $links->trim = route('database.cars.trim', [
                $this->make_slug,
                $this->year_from,
                $this->model_slug,
                $this->series_slug,
                $this->trim_slug,
            ]);
        }

        return $links;
    }

}
