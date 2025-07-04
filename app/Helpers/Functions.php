<?php

namespace App\Helpers;

use App\Exceptions\ItemHashException;
use App\Models\Base;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 *
 */
class Functions
{

    /**
     * @param $key
     *
     * @return array|\Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\Translation\Translator|\Illuminate\Foundation\Application|mixed|string|null
     */
    public static function __($key)
    {
        return __('frontend.'.$key) == 'frontend.'.$key ? $key : __('frontend.'.$key);
    }

    /**
     * @param  \App\Models\Base  $model
     *
     * @return string
     */
    public static function encryptItemToHash(Base $model): string
    {
        return Crypt::encryptString(get_class($model).':'.$model->id);
    }

    /**
     * @throws \App\Exceptions\ItemHashException
     */
    public static function decryptItemHash(string $hash = null)
    {
        if (!$hash) {
            throw new ItemHashException('Something went wrong #'.__LINE__);
        }

        $decryptedHash = Crypt::decryptString($hash);
        $decryptedHashParts = explode(':', $decryptedHash);

        if (count($decryptedHashParts) !== 2) {
            Log::warning('Hash Decryption should be an array of 2.');
            throw new ItemHashException('Something went wrong #'.__LINE__);
        }

        if (!class_exists($decryptedHashParts[0])) {
            Log::warning('Hash Decryption key 0 class does not exist.');
            throw new ItemHashException('Something went wrong #'.__LINE__);
        }

        return $decryptedHashParts[0]::find($decryptedHashParts[1]);
    }

    public static function getCachedModels(Builder $model, Carbon $expiry = null)
    {
        $cacheKey = Str::slug($model->toSql(), '_');

        $configKey = 'cache.features.'.Str::lower(Str::replace('\\', '_', get_class($model->newModelInstance())));

        if (!config($configKey)) {
            return $model->get();
        }

        if (config($configKey.'.enabled')) {
            !Cache::has(Hash::make($cacheKey))
            && Cache::put(Hash::make($cacheKey),
                $expiry ?? config($configKey.'.expiry', Carbon::now()->addSeconds(1)));

            return Cache::get(Hash::make($cacheKey)) ?? $model->get();
        } else {
            Log::info('Config cache key settings not set. '.$configKey);
        }

        // Delete cache if it's not enabled
        Cache::delete($cacheKey);

        return $model->get();
    }

    public static function addToSession(int $status, string $message)
    {
        $data[] = ['status' => $status, 'message' => $message];

        if (session()->get('message')) {
            $data = array_merge($data, session()->get('message'));
        }

        return session()->flash('message', $data);
    }

}
