<?php

namespace App\Http\Controllers;

use App\Models\Permalink;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response as SymphonyResponse;


/**
 *
 */
class PermalinkController extends Controller
{
    public static function generateUniquePermalink(Model $model, int $length = 1)
    {
        $url = Str::random($length);

        if (Permalink::where(['url' => $url])->exists()) {
            Log::info('Permalink already found, trying a new one. // '.$url);

            return self::generateUniquePermalink($model, $length + 1);
        }

        if (config('site.notifications.slack.permalink.created')) {
            Log::info('New Permalink: // '.route('permalink.single', $url));
        }

        return $model->permalink()->updateOrCreate(['url' => $url], ['url' => $url]);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Permalink  $permalink
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function goTo(Request $request, Permalink $permalink): RedirectResponse
    {
        $permalink->increment('hits');

        if (!$permalink->item) {
            abort(404);
        }

        return Response::redirectTo(
            $permalink->item->links->item,
            SymphonyResponse::HTTP_MOVED_PERMANENTLY
        );
    }
}
