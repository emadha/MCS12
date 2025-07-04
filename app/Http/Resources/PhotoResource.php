<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PhotoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name'       => $this->id.'_'.$this->filename,
            'h'          => $this->item_hash,
            'filename'   => $this->filename,
            'path'       => $this->path,
            'is_cover'   => $this->is_cover,
            'is_primary' => $this->is_primary,
            'published'  => $this->published,
            'success'    => 1, // used for Edit forms
            'status'     => 1, // used for Edit forms
        ];
    }
}
