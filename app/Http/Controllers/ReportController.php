<?php

namespace App\Http\Controllers;

use App\Events\Reports\ItemReportedEvent;
use App\Helpers\Functions;
use App\Models\Report;
use App\Rules\ItemHashValidation;
use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 *
 */
class ReportController extends Controller
{
    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response
     * @throws \App\Exceptions\ItemHashException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function submit(Request $request): \Illuminate\Foundation\Application|\Illuminate\Http\Response|Application|ResponseFactory
    {
        $this->validate($request, [
            'email'   => Auth::check() ? '' : 'required|email',
            'message' => 'required|min:10',
            'h'       => ['required', new ItemHashValidation()],
        ]);

        $itemHash = Functions::decryptItemHash($request->get('h'));

        try {
            $reportCreated = Report::create([
                'email'     => Auth::user()?->email ?? $request->get('email'),
                'item_type' => get_class($itemHash),
                'item_id'   => $itemHash->id,
                'message'   => $request->get('message'),
            ]);

            if ($reportCreated) {
                Event::dispatch(new ItemReportedEvent($reportCreated));

                return response([
                    'status'  => 1,
                    'message' => __('frontend.Thank you, Your report was submitted successfully'),
                ]);
            } else {
                return response([
                    'status'  => 0,
                    'message' => __('frontend.Failed'),
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
        } catch (Exception $exception) {
            Log::warning('Reports::'.$exception->getMessage());

            return response([
                'status'  => -1,
                'message' => __('frontend.Failed'),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }
}
