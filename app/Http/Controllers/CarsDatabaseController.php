<?php

namespace App\Http\Controllers;

use App\Http\Resources\CarDB\CarDBResource;
use App\Models\Car;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;

class CarsDatabaseController extends DatabaseController
{

    public function index(Request $request)
    {
        $data = self::getAllMakes($request);
        $viewData = [
            'title' => 'Cars Database',
            'data'  => $data,
        ];

        View::share($viewData);

        return Inertia::render('Database/Cars/Index', $viewData);
    }

    public function byMake(Request $request, $make_slug)
    {
        $makes_slug = explode(',', $make_slug);

        $data = DB::table('cars')
            ->whereIn('make_slug', $makes_slug)
            ->distinct()
            ->select([
                'make', 'make_slug',
                'year_from',
            ])->orderByDesc('year_from');

        self::setCarCommonColumn($data, $request);

        $data = $data->get();

        $viewData = [
            'title'     => $data->first()->make,
            'years'     => $data->pluck('year_from'),
            'make_slug' => $make_slug,
        ];

        return $request->expectsJson()
            ? $data->get()
            : Inertia::render('Database/Cars/ByMake', $viewData);
    }

    public function byMakeAndYear(Request $request, string $make_slug, string $year_from)
    {
        $data = DB::table('cars')
            ->where([
                'make_slug' => $make_slug,
            ])
            ->where('year_from', '>=', $year_from)
            ->distinct()
            ->select(['make', 'make_slug', 'model', 'model_slug', 'year_from'])
            ->get();

        return $request->expectsJson()
            ? $data->get()
            : Inertia::render('Database/Cars/ByYear', [
                'title'     => 'title',
                'make_slug' => $make_slug,
                'year'      => $year_from,
                'models'    => $data,
            ]);
    }

    public function byMakeAndYearAndModel(Request $request, string $make_slug, string $year_from, string $model_slug)
    {
        $data = DB::table('cars');
        self::setCarCommonColumn($data, $request);
        $data = $data->where('make_slug', $make_slug);
        $data = $data->where('year_from', '>=', $year_from);
        $data = $data->where('model_slug', $model_slug);
        $data = $data->get();

        $viewData = [];
        return $request->expectsJson()
            ? $data->get()
            : Inertia::render('Database/Cars/ByMakeAndYear', $viewData);
    }

    public function findCarBy(
        Request $request,
        string $make_slug = null,
        string $year_from = null,
        string $model_slug = null,
        string $series_slug = null,
        string $trim_slug = null
    ) {
        $title = "Cars Database";
        $distinct = ['make', 'make_slug'];
        $select = ['make', 'make_slug'];
        $viewName = 'Database/Cars/By';
        $orderBy = null;
        $orderByDirection = 'ASC';

        $data = Car::query();

        $validator = Validator::make([
            'make_slug'   => $make_slug,
            'year_from'   => $year_from,
            'model_slug'  => $model_slug,
            'series_slug' => $series_slug,
            'trim_slug'   => $trim_slug,
        ], [
            'make_slug'   => 'nullable|exists:cars,make_slug',
            'year_from'   => 'nullable|exists:cars,year_from',
            'model_slug'  => 'nullable|exists:cars,model_slug',
            'series_slug' => 'nullable|exists:cars,series_slug',
            'trim_slug'   => 'nullable|exists:cars,trim_slug',
        ], [
            'make_slug.exists'   => 'Invalid Car Make',
            'year_from.exists'   => 'Invalid Year',
            'model_slug.exists'  => 'Invalid Car Model',
            'series_slug.exists' => 'Invalid Car Series',
            'trim_slug.exists'   => 'Invalid Car Series',
        ]);

        if ($validator->fails()) {
            return Inertia::render($viewName,
                ['errors' => $validator->errors()]);
        }

        if ($make_slug) {
            $data = $data->where('make_slug', $make_slug);
            $title = 'Select car by Make';
            $orderBy = 'model_slug';
            $orderByDirection = 'DESC';
            $select = [...$select, 'model','model_slug'];
            $distinct = [...$distinct, 'model'];
            $viewName .= 'Make';
        }
//        if ($year_from) {
//            $data = $data->where('year_from', '>=', $year_from);
//            $title = 'Select car model by Year';
//            $orderBy = 'model_slug';
//            $orderByDirection = 'ASC';
//            $select = [...$select, 'model', 'model_slug'];
//            $distinct = [...$distinct, 'model', 'model_slug'];
//            $viewName .= 'AndYear';
//        }

        if ($model_slug) {
            $data = $data->where('model_slug', $model_slug);
            $title = 'Select car by Model';
            $orderBy = 'model_slug';
            $orderByDirection = 'ASC';
            $select = [...$select, 'series', 'series_slug'];
            $distinct = [...$distinct, 'series', 'series_slug'];
            $viewName .= 'AndModel';
        }
        if ($series_slug) {
            $data = $data->where('series_slug', $series_slug);
            $title = 'Select car by Series';
            $orderBy = 'model_slug';
            $orderByDirection = 'ASC';
            $select = [...$select, 'trim', 'trim_slug'];
            $distinct = [...$distinct, 'trim', 'trim_slug'];
            $viewName .= 'AndSeries';
        }
        if ($trim_slug) {
            $data = $data->where('trim_slug', $trim_slug);
            $title = 'Select car by Trim';
            $orderBy = 'model_slug';
            $orderByDirection = 'ASC';
            $viewName .= 'AndTrim';
        }

        if ($orderBy) {
            $data->orderBy($orderBy, $orderByDirection);
        }

        $viewData = [
            'title'       => $title,
            'make_slug'   => $make_slug,
            'year_from'   => $year_from,
            'model_slug'  => $model_slug,
            'series_slug' => $series_slug,
            'trim_slug'   => $trim_slug,
            'data'        => CarDBResource::collection($data
                ->select($select)
                ->distinct($distinct)
                ->get()),
        ];

        # dd($viewData,$viewName);

        return $request->expectsJson()
            ? $data->get()
            : Inertia::render($viewName, $viewData);
    }

    public function byMakeAndModel(Request $request, string $make_slug, string $model_slug)
    {
        $make_slug = explode(',', $make_slug);
        $model_slug = explode(',', $model_slug);

        $data = DB::table('cars')
            ->whereIn('make_slug', $make_slug)
            ->whereIn('model_slug', $model_slug)
            ->distinct()->select([
                'make', 'model', 'series',
                'make_slug', 'model_slug', 'series_slug',
            ]);

        self::setCarCommonColumn($data, $request);

        if ($request->expectsJson()) {
            return $data->get();
        }

        $data = $data->get();
        $viewData = [
            'title'      => $data->first()->make.' '.$data->first()->model.' Series',
            'make'       => $data->first()->make,
            'make_slug'  => $data->first()->make_slug,
            'model'      => $data->first()->model,
            'model_slug' => $data->first()->model_slug,
            'series'     => $data,
        ];

        View::share($viewData);
        return Inertia::render(
            'Database/Cars/ByModel', $viewData
        );
    }

    public function byMakeAndModelAndSeries(
        Request $request,
        string $make_slug,
        string $model_slug,
        string $series_slug
    ) {
        $make_slug = explode(',', $make_slug);
        $model_slug = explode(',', $model_slug);
        $series_slug = explode(',', $series_slug);

        $data = DB::table('cars')
            ->whereIn('make_slug', $make_slug)
            ->whereIn('model_slug', $model_slug)
            ->whereIn('series_slug', $series_slug)
            ->select([
                'make',
                'make_slug',
                'model',
                'model_slug',
                'series',
                'series_slug',
                'trim',
                'trim_slug',
            ]);

        self::setCarCommonColumn($data, $request);

        if ($request->expectsJson()) {
            return $data->get();
        }

        $data = $data->get();

        $viewData = [
            'title'       => $data->first()->make.' '.$data->first()->model.' '.$data->first()->series.' Trims',
            'trims'       => $data,
            'make'        => $data->first()->make,
            'make_slug'   => $data->first()->make_slug,
            'model'       => $data->first()->model,
            'model_slug'  => $data->first()->model_slug,
            'series'      => $data->first()->series,
            'series_slug' => $data->first()->series_slug,
        ];
        View::share($viewData);

        return Inertia::render('Database/Cars/BySeries', $viewData);
    }

    public function byMakeAndYearAndModelAndSeriesAndTrim(
        Request $request,
        string $make_slug,
        string $year_from,
        string $model_slug,
        string $series_slug,
        string $trim_slug
    ) {
        $data = Car::where([
            'make_slug'   => $make_slug,
            'model_slug'  => $model_slug,
            'series_slug' => $series_slug,
            'trim_slug'   => $trim_slug,
        ])->where('year_from', '>=', $year_from);

        if ($request->expectsJson()) {
            return $data->get();
        }
        $data = $data->first();

        $viewData = [
            'title'       => $data->make.' '.$data->model.' '.$data->series.' Trims',
            'car'         => $data,
            'make_slug'   => $data->make_slug,
            'year'        => $data->year_from,
            'model_slug'  => $data->model_slug,
            'series_slug' => $data->series_slug,
            'trim_slug'   => $data->trim_slug,
        ];

        View::share($viewData);
        return Inertia::render('Database/Cars/ByMakeAndYearAndModelAndSeriesAndTrim', $viewData);
    }

    public static function getAllMakes(Request $request)
    {
        return Cache::remember(('cars.makes.'
            .'.'.$request->get('yf')
            .'.'.$request->get('yt'))
            , 10, function () use ($request) {
                $Cars = DB::table('cars')
                    ->distinct()
                    ->select(['make', 'make_slug']);

                self::setCarCommonColumn($Cars, $request);

                return $Cars->get();
            });
    }

    private static function setCarCommonColumn(Builder $car, Request $request): void
    {
        if ($request->has('yf')) {
            $car->where(function (Builder $query) use ($request) {
                $query->where('year_from', '=', $request->get('yf'));
                // $query->where('year_to', '<=', $request->get('yearFrom'));
            });
        }
    }

}
