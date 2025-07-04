<?php

namespace App\Http\Resources\Shop;

use App\Enum\StatsEnum;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class StatsGroupResource extends JsonResource
{

    public string $date;

    public function __construct($resource, string $date)
    {
        parent::__construct($resource);

        $this->date = $date;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        if (!$this->date) {
            return [];
        }

        $dateStart = Carbon::createFromFormat('Y-m-d H:i', $this->date)->startOfDay();
        $dateEnd = Carbon::createFromFormat('Y-m-d H:i', $this->date)->endOfDay();

        /** @var \App\Models\Shop $this */
        $visitsActivitiesAuth = $this
            ->stats()
            ->select(
            // Date
                DB::raw('hour(created_at) as hour'),
                // Count logged in views
                DB::raw('SUM(IF(user_id IS NOT NULL, 1,0)) AS views_auth'),
                // Count not logged in views
                DB::raw('SUM(IF(user_id IS NULL, 1,0)) AS views_not_auth'),
                // Count total in views
                DB::raw('COUNT(*) AS views_total'),
            )
            ->whereIn('type', [StatsEnum::VIEW->name])
            ->whereBetween('created_at', [$dateStart, $dateEnd])
            ->groupBy(DB::raw('hour(created_at)'));

        return $visitsActivitiesAuth->get()->toArray();
    }

}
