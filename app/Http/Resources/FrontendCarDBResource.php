<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FrontendCarDBResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $display = $this->resource->toArray($request);
        $formattedDisplay = [];
        unset($display['car_details.trim_slug'],
            $display['car_details.id_trim'],
            $display['car_details.make_slug'],
            $display['car_details.model_slug'],
            $display['car_details.series_slug'],
        );

        foreach($display as $_key=>$_value){
            $formattedDisplay[__('car_details.'.$_key)] = $_value;
        }

        return $formattedDisplay;
    }
}
