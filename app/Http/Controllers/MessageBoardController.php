<?php

namespace App\Http\Controllers;

use App\Helpers\Functions;
use App\Http\Resources\MessageBoard\MessageBoardBriefResource;
use App\Http\Resources\MessageBoard\MessageBoardWithMessagesResource;
use App\Models\MessageBoard;
use hisorange\BrowserDetect\Exceptions\Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;

/**
 *
 */
class MessageBoardController extends Controller
{

    /**
     * @return mixed
     */
    public static function getMessageBoards()
    {
        $messageBoards = MessageBoard::whereHas('participants', function (Builder $message) {
            $message->where('user_id', Auth::id());
        })->orderByDesc('last_activity');

        return $messageBoards->with(['sender', 'sender.profilePicture', 'user', 'user.profilePicture']);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $data = [
            'title'         => 'Messages',
            'conversations' => MessageBoardBriefResource::collection(Functions::getCachedModels(
                MessageBoardController::getMessageBoards()->limit(10)->orderByDesc('updated_at')
            )),
        ];

        View::share($data);

        return Inertia::render('Messages/Index', $data);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Inertia\Response
     */
    public function newMessage(Request $request)
    {
        return Inertia::render('Messages/New',
            [
                'title' => 'New Message',
            ]);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     * @throws \hisorange\BrowserDetect\Exceptions\Exception
     */
    public function newMessageStore(Request $request): \Illuminate\Http\RedirectResponse
    {
        $this->validate($request, [
            'user'    => 'required|exists:users,id',
            'message' => 'required',
        ]);

        if (!$request->user()->can('send_message', new MessageBoard())) {
            return back()->withErrors(['', session()->get('message')]);
        }

        // Create a new Message board
        /** @var MessageBoard $messageBoard */
        $messageBoard = MessageBoard::create(['user_id' => Auth::id()]);

        if (!$messageBoard) {
            throw new Exception('Could not create message board #'.__LINE__);
        }

        // Add message board participants, add Auth id as well
        foreach ([Auth::id(), ...$request->get('user')] as $user) {
            $messageBoard->participants()->firstOrCreate(
                ['user_id' => $user], ['user_id' => $user]
            );
        }

        $messageBoard->messages()->create([
            'user_id' => Auth::id(),
            'content' => $request->get('message'),
        ]);

        return response()
            ->redirectTo(route('messages.board.single', $messageBoard->uuid))
            ->with(['status' => 1]);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\MessageBoard  $messageBoard
     *
     * @return \Inertia\Response
     */
    public function single(Request $request, MessageBoard $messageBoard): \Inertia\Response
    {
        if (!Auth::user()?->can('view', $messageBoard)) {
            abort(404);
        }

        $data = [
            'title'         => 'Messages',
            'conversations' => MessageBoardBriefResource::collection(
                Functions::getCachedModels(
                    MessageBoardController::getMessageBoards()->limit(10)
                )
            ),
            'conversation'  => $messageBoard->id ? new MessageBoardWithMessagesResource($messageBoard) : ['data' => []],
        ];

        View::share($data);

        return Inertia::render('Messages/Index', $data);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\MessageBoard  $messageBoard
     *
     * @return \Illuminate\Support\Collection
     */
    public function contextMenu(Request $request, MessageBoard $messageBoard)
    {
        $contextMenu = collect([]);

        $contextMenu->add([
            'title'     => __('frontend.Leave'),
            'action_id' => 'leave',
            'icon'      => '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="pen-to-square" class="svg-inline--fa fa-pen-to-square " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"></path></svg>',
        ]);

        $contextMenu->add([
            'title'     => __('frontend.Delete'),
            'action_id' => 'delete',
            'icon'      => '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" class="svg-inline--fa fa-xmark " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path></svg>',
        ]);

        $contextMenu->add([
            'title'     => __('frontend.Block'),
            'action_id' => 'block',
            'icon'      => '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" class="svg-inline--fa fa-xmark " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path></svg>',
        ]);

        $contextMenu->add([
            'title'     => 'Report',
            'action_id' => 'report',
            'icon'      => '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="flag" class="svg-inline--fa fa-flag " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24V64 350.5 400v88c0 13.3 10.7 24 24 24s24-10.7 24-24V388l80.3-20.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L48 52V24zm0 77.5l96.6-24.2c27-6.7 55.5-3.6 80.4 8.8c54.9 27.4 118.7 29.7 175 6.8V334.7l-24.4 9.1c-33.7 12.6-71.2 10.7-103.4-5.4c-48.2-24.1-103.3-30.1-155.6-17.1L48 338.5v-237z"></path></svg>',
        ]);

        return $contextMenu;
    }

}
