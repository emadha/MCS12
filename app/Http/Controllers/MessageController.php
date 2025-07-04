<?php

namespace App\Http\Controllers;

use App\Helpers\Functions;
use App\Http\Resources\MessageBoard\MessageBoardBriefResource;
use App\Http\Resources\Messages\MessageResource;
use App\Models\Message;
use App\Models\MessageBoard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;


/**
 *
 */
class MessageController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Inertia\Response
     */
    public function index(Request $request): \Inertia\Response
    {
        $myMessages = Message::mine();
        $conversations = collect([]);

        $myMessages->get()->each(function ($item) use ($conversations) {
            $conversationID = $item->user_id === Auth::id() ? $item->target_id : $item->user_id;
            $conversations->put($conversationID, $item);
        });

        $myMessagesResource = MessageResource::collection($conversations);

        return Inertia::render('Messages/Index', [
            'title'         => 'Messages',
            'conversations' => $myMessagesResource,
        ]);
    }

    public function messageBoardSingle(Request $request, MessageBoard $messageBoard)
    {
        $messages = $messageBoard->messages;
        $messageBoard = $messageBoard->load(['messages', 'messages.user']);

        return new MessageBoardBriefResource($messageBoard);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\MessageBoard  $message_board_uuid
     *
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function sendMessage(Request $request, MessageBoard $message_board_uuid)
    {
        $this->validate($request, [
            'message' => 'required|min:1',
        ]);

        if (!$request->user()->can('payForMessage', $message_board_uuid)) {
            Functions::addToSession(1, 'You currently cannot send messages here... minimum needed credits amount is '.config('credits.prices.send_message').'.');

            return back()->withErrors(['']);
        }

        if (!$request->user()->can('send_message', $message_board_uuid)) {
            return back()->withErrors(['', session()->get('message')]);
        }

        $message_board_uuid->messages()->create([
            'user_id' => Auth::id(),
            'content' => $request->get('message'),
        ]);

        return response()->redirectTo(route('messages.board.single', $message_board_uuid->uuid));
    }

    public function contextMenu(Request $request, Message $message)
    {
        $contextMenu = collect([]);

        if ($request->user()?->can('unsend', $message)) {
            $contextMenu->add([
                'title'     => __('frontend.Unsend'),
                'action_id' => 'unsend',
                'icon'      => '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" class="svg-inline--fa fa-xmark " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path></svg>',
            ]);
        }

        $contextMenu->add([
            'title'     => 'Report',
            'action_id' => 'report',
            'icon'      => '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="flag" class="svg-inline--fa fa-flag " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24V64 350.5 400v88c0 13.3 10.7 24 24 24s24-10.7 24-24V388l80.3-20.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L48 52V24zm0 77.5l96.6-24.2c27-6.7 55.5-3.6 80.4 8.8c54.9 27.4 118.7 29.7 175 6.8V334.7l-24.4 9.1c-33.7 12.6-71.2 10.7-103.4-5.4c-48.2-24.1-103.3-30.1-155.6-17.1L48 338.5v-237z"></path></svg>',
        ]);

        return $contextMenu;
    }

    public function action_unsend(Request $request, Message $message)
    {
        if (!Auth::check()) {
            abort(ResponseAlias::HTTP_UNAUTHORIZED, "Unauthorized");
        }

        if (!$request->user()?->can('unsend', $message)) {
            return [
                'status'  => -1,
                'message' => 'You cannot unsend this message',
            ];
        }

        if ($message->forceDelete()) {
            return [
                'status'  => 1,
                'message' => 'Message Unsent',
            ];
        } else {
            return [
                'status'  => -1,
                'message' => 'Could not unsend this message',
            ];
        }
    }

}
