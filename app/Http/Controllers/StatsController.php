<?php

namespace App\Http\Controllers;

use App\Enum\StatsEnum;
use App\Models\Base;
use App\Models\User;
use App\Traits\HasStats;
use Exception;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

/**
 *
 */
class StatsController extends Controller
{

    /**
     * Add Stats to model
     *
     * @param  string  $type  must be from StatsEnum
     * @param  \App\Models\Base  $model
     * @param  \App\Models\User|\Illuminate\Contracts\Auth\Authenticatable|null  $user
     * @param  string|null  $note
     *
     * @return \Illuminate\Database\Eloquent\Model
     * @throws \Exception
     */
    public static function create(string $type, Base $model, User|Authenticatable $user = null, string $note = null): Model
    {
        if (!in_array($type, StatsEnum::names())) {
            throw new Exception('Trying to record stats for model '.get_class($model).' but the type is invalid');
        }

        if (!in_array(HasStats::class, class_uses($model))) {
            throw new Exception('Trying to record stats for model '.get_class($model).', but it does not uses HasStats trait.');
        }

        return $model->stats()->create([
            'uuid'    => Uuid::uuid8(session()->getId()),
            'user_id' => $user?->id,
            'type'    => $type,
            'note'    => $note,
        ]);
    }

}
