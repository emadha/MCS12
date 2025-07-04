<?php

namespace App\Http\Controllers\Admin;

use App\Http\Resources\Admin\Car\AdminCarResource;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;

/**
 *
 */
class AdminCarsDBController extends AdminController
{

    /**
     * @var string
     */
    public static string $model = Car::class;

    /**
     * @var string
     */
    public static string $controller = \App\Http\Controllers\CarController::class;

    /**
     * @var string
     */
    public static string $title = 'Cars Database';

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $data = [
            'title' => 'Cars Database',
            'cars'  => AdminCarResource::collection(Car::paginate(50)),
        ];
        View::share($data);

        return Inertia::render('CarsDB/Index', $data);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Car  $id_trim
     *
     * @return \Inertia\Response
     */
    public function single(Request $request, Car $id_trim)
    {
        $data = [
            'title' => 'Single',
            'car'   => new AdminCarResource($id_trim),
        ];
        View::share($data);

        return Inertia::render('CarsDB/Single', $data);
    }

    public function formPatch(Request $request, Car $id_trim)
    {
        $columns = Schema::getColumnListing($id_trim->getTable());
        $id_trim->update($request->only($columns));

        if ($id_trim->wasChanged()) {
            return back()->with('success', 'Car updated successfully');
        } else {
            return back()->withErrors('Car update failed');
        }
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Car  $car
     *
     * @return \Inertia\Response
     */
    public function form(Request $request, Car $car)
    {
        $data = [
            'title' => $car->id ? 'Edit '.$car->id_trim : 'New',
            'car'   => new AdminCarResource($car),
        ];

        return Inertia::render('CarsDB/Form', $data);
    }

}
