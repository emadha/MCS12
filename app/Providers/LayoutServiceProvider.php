<?php

namespace App\Providers;

use App\Helpers\ConstantsHelper;
use App\Models\Settings;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

use function request;

class LayoutServiceProvider extends ServiceProvider
{

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        // Set the current region to default region
        config()->set('site.regions.current', config('site.regions.default'));
        config()->set('site.locales.current', config('site.locales.default'));
        config()->set('site.currencies.current', config('site.currencies.default'));

        if (Cookie::has('locale') && array_key_exists(Cookie::get('locale'), config('site.locales.list'))) {
        } else {
            Cookie::queue(
                Cookie::make(
                    'locale',
                    'en',
                    0,
                    '/',
                    env('SESSION_DOMAIN'),
                    true
                )
            );
        }

        $localeCookie = Cookie::get('locale') ?? 'en';

        if (array_key_exists($localeCookie, config('site.locales.list'))) {
            config()->set('site.locales.current', $localeCookie);
        }

        $host = parse_url(request()->url(), PHP_URL_HOST);

        $allowedSubDomains = config('site.regions.list');
        if (array_key_exists($subdomain = explode('.', $host)[0], $allowedSubDomains)) {
            $data['domain'] = $subdomain;
            $data['domain_long'] = $allowedSubDomains[$subdomain];
            config()->set('site.regions.current', $subdomain);
        }

        config()->set('site.credits.enabled', config('credits.enabled'));

        try {
            Settings::all()->each(function ($setting) {
                config()->set('site.settings.'.$setting->key, $setting->value);
            });
        } catch (\Exception $exception) {
            Log::critical('Settings: '.$exception->getMessage());
        }

        $data = [
            'title'                        => config('site.settings.site_title', config('app.name')),
            'description'                  => config('site.settings.site_description', config('app.description')),
            'robots'                       => ConstantsHelper::ROBOTS[config('site.settings.site_robots', 0)],
            'app_title'                    => config('app.short'),
            'locale'                       => $localeCookie,
            'restrictions'                 => [
                ...config('site.filter'),
            ],
            'lang'                         => [...__('frontend', [], 'en'), ...__('frontend')],
            // todo note: RTL is not only arabic
            'rtl'                          => app()->isLocale('ar'),
            'settings'                     => collect(config('site'))
                ->only([
                    'comments',
                    'credits',
                    'ads',
                    'listing',
                    'regions',
                    'locales',
                    'currencies',
                ]),
            'FACEBOOK_LOGIN_REDIRECT_URL'  => env('FACEBOOK_REDIRECT_URL'),
            'GOOGLE_LOGIN_REDIRECT_URL'    => env('GOOGLE_REDIRECT'),
            'MICROSOFT_LOGIN_REDIRECT_URL' => env('MICROSOFT_REDIRECT'),
        ];

        View::share($data);
        Inertia::share($data);
    }

}
