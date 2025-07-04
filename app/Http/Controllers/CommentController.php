<?php

namespace App\Http\Controllers;

use App\Helpers\Functions;
use App\Http\Resources\Comments\CommentsBlocksResource;
use App\Rules\ItemHashValidation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

/**
 *
 */
class CommentController extends Controller
{

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @return mixed
     * @throws \App\Exceptions\ItemHashException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function for(Request $request)
    {
        $this->validate($request, [
            'for' => new ItemHashValidation(),
        ]);

        $Item = Functions::decryptItemHash($request->get('h'));

        return CommentsBlocksResource::collection($Item->comments()->orderByDesc('created_at')->get());
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @return array
     * @throws \App\Exceptions\ItemHashException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function submit(Request $request)
    {
        if (!Auth::check()) {
            abort(ResponseAlias::HTTP_UNAUTHORIZED);
        }

        $this->validate($request, [
            'h'    => new ItemHashValidation(),
            'body' => 'required|min:1|max:500',
        ]);

        $Item = Functions::decryptItemHash($request->get('h'));

        $commentCreated = $Item->comments()->create([
            'user_id' => Auth::id(),
            'body'    => $request->get('body'),
        ]);

        if ($commentCreated) {
            return [
                'status'  => 1,
                'message' => 'Comment successfully submitted',
                'comment' => $commentCreated,
            ];
        } else {
            return [
                'status'  => 0,
                'message' => 'Could not submit comment',
            ];
        }
    }

}
