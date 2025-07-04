<?php

namespace App\Http\Controllers;

use App\Helpers\Functions;
use App\Rules\ItemHashValidation;
use hisorange\BrowserDetect\Exceptions\Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Symfony\Component\HttpFoundation\Response;

/**
 *
 */
class ActionsController extends Controller
{

    const ACTION_METHODS_NAME = 'action_';

    /**
     *
     */
    public function __construct() {}

    public function action(Request $request)
    {
        $allowedTo = [
            'report',
            'delete',
            'unsend',
            'leave',
            'mark_as_sold',
            'mark_as_not_sold',
            'approve',
            'disapprove',
            'make_primary',
            'make_cover',
            'publish',
            'unpublish',
            'shop_link',
        ];

        if (!$request->has('h')) {
            abort(Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->validate($request, [
            'h'  => [new ItemHashValidation()],
            'to' => 'in:'.implode(',', $allowedTo),
        ]);

        $actionMethodName = static::ACTION_METHODS_NAME.$request->get('to');

        $Item = Functions::decryptItemHash($request->get('h'));

        if (!(new \ReflectionClass($Item->controller()))->hasMethod($actionMethodName)) {
            throw new Exception('Missing Method #'.__LINE__);
        }

        return $Item->controller()->$actionMethodName($request, $Item);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Foundation\Application|\Illuminate\Http\Response|void
     * @throws \Illuminate\Validation\ValidationException
     */
    public function favorite(Request $request)
    {
        $this->validate($request, ['h' => ['required', new ItemHashValidation()]]);

        try {
            $Item = Functions::decryptItemHash($request->get('h'));

            return $Item->toggleFavorite();
        } catch (UnauthorizedException $e) {
            Functions::addToSession(1, 'Item added to favorites');
            return response([
                'status'  => -1,
                'message' => __('frontend.NOT_AUTHORIZED_MSG'),
            ], Response::HTTP_UNAUTHORIZED);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            Functions::addToSession(1, 'Failed to add Item to favorites');
            return response([
                'status'  => -1,
                'message' => 'Action failed',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

}
