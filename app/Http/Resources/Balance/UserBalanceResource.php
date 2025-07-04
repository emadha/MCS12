<?php

namespace App\Http\Resources\Balance;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property \Carbon\Carbon $created_at
 */
class UserBalanceResource extends JsonResource
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
            'amount'      => number_format($this->amount),
            'target_link' => $this->item?->deleted_at ? null : $this->item?->links->item,
            'target_text' => $this->item?->display?->title ?? null,
            'created_at'  => $this->created_at
                ->format('d D, d M Y g:i a'),
        ];
    }

}
