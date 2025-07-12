<?php

namespace App\Http\Resources\Listing;

use App\Http\Resources\ListingItem\ListingItemFormResource;
use App\Http\Resources\PhotoResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingFormResource extends JsonResource
{
    public static $wrap = false;

    public function toArray(Request $request)
    {
        return [
            'id'               => $this->id,
            'title'            => $this->title,
            'description'      => $this->description,
            'condition'        => $this->condition,
            'item'             => new ListingItemFormResource($this->item),
            'photos'           => PhotoResource::collection($this->photos),
            'currency'         => $this->currency,
            'price'            => $this->price,
            'keywords'         => $this->keywords,
            'shop_id'          => $this->shop_id,
            'shop'             => $this->shop,
            'user_id'          => $this->user_id,
            'view'             => $this->views,
            'is_approved'      => $this->is_approved,
            'is_published'     => $this->is_published,
            'sold_at'          => $this->sold_at,
            'opening_time'     => $this->opening_time,
            'closing_time'     => $this->closing_time,
            'opening_days'     => $this->opening_days,
            'established_date' => $this->established_date,
            'created_at'       => $this->created_at,
            'updated_at'       => $this->updated_at,
            'deleted_at'       => $this->deleted_at,
            'location'         => $this->relationPredefinedLocation->id,
        ];
    }
}
