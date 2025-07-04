<?php

namespace App\Http\Controllers;

use App\Helpers\Functions;
use App\Rules\ItemHashValidation;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ContextMenuController extends Controller
{

    public function getContextMenuByItem(Request $request)
    {
        $this->validate($request,
            [
                'h' => new ItemHashValidation(),
                'c' => 'nullable|in:default,main',
            ]
        );

        $item = Functions::decryptItemHash($request->get('h'));

        $methodName = $request->get('c', 'contextMenu');

        if (!(new \ReflectionClass($item->controller()))->hasMethod($methodName)) {
            abort(Response::HTTP_BAD_REQUEST, 'No Context Available #'.__LINE__);
        }

        return $item->controller()->$methodName($request, $item);
    }

}
