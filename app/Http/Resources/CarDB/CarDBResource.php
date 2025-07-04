<?php

namespace App\Http\Resources\CarDB;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarDBResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [];

        if (isset($this->make)) {
            $data['make'] = $this->make;
            $data['make_slug'] = $this->make_slug;
        }

        if (isset($this->year_from)) {
            $data['year'] = $this->year_from;
        }

        if (isset($this->model)) {
            $data['model'] = $this->model;
            $data['model_slug'] = $this->model_slug;
        }

        if (isset($this->series)) {
            $data['series'] = $this->series;
            $data['series_slug'] = $this->series_slug;
        }

        if (isset($this->trim)) {
            $data['trim'] = $this->trim;
            $data['trim_slug'] = $this->trim_slug;
        }

        if (isset($this->links)) {
            $data['links'] = $this->links;
        }
        return $data;
    }

}
