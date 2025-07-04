<?php

namespace App\Http\Resources\Shop;

use App\Enum\StatsEnum;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class StatsResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Init date
        $dateFrom = Carbon::now()->startOfMonth();
        $dateTo = Carbon::now();

        // Process date from request
        try {
            if ($request->get('f')) {
                $dateFrom = Carbon::createFromFormat('Y-m-d', $request->get('f'))->endOfDay();
            }
        } catch (\Exception) {
            return ['status' => -1, 'message' => 'Invalid date'];
        }

        try {
            if ($request->get('t')) {
                $dateTo = Carbon::createFromFormat('Y-m-d', $request->get('t'))->endOfDay();
            }
        } catch (\Exception) {
            return ['status' => -1, 'message' => 'Invalid date'];
        }

        // Format date
        $dateFrom = $dateFrom->subMonth()->startOfDay()->format('Y-m-d');
        $dateTo = $dateTo->addDay()->startOfDay()->format('Y-m-d');

        /** @var \App\Models\Shop $this */
        $visitsActivitiesAuth = $this
            ->stats()
            ->select(
            // Date
                DB::raw('DATE_FORMAT(DATE(created_at), "%Y-%m-%d %H:%i") as date'),
                // Count logged in views
                DB::raw('SUM(IF(user_id IS NOT NULL, 1,0)) AS views_auth'),
                // Count not logged in views
                DB::raw('SUM(IF(user_id IS NULL, 1,0)) AS views_not_auth'),
                // Count total in views
                DB::raw('COUNT(*) AS views_total'),
            )
            ->whereIn('type', [StatsEnum::VIEW->name])
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->groupBy('date');;

        return $visitsActivitiesAuth->get()->toArray();
    }

}
