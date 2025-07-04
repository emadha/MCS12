<?php

namespace App\Traits;

use App\Http\Controllers\PermalinkController;
use App\Models\Permalink;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

trait HasPermalink
{

    public static function bootHasPermalink()
    {
        // fixme move elsewhere
        //        static::retrieved(function (Model $model) {
        //            if (!$model->permalink) {
        //                PermalinkController::generateUniquePermalink($model);
        //            }
        //        });
    }

    public function createPermalink() {}

    public function permalink()
    {
        return $this->morphOne(Permalink::class, 'item');
    }

}
