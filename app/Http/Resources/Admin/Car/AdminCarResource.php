<?php

namespace App\Http\Resources\Admin\Car;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminCarResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...parent::toArray($request),
            'id_trim' => $this->id_trim,
            'link'    => route('admin.cars_db.single', $this->id_trim),
        ];
    }

}
