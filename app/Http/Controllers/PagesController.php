<?php

namespace App\Http\Controllers;

use App\Helpers\Functions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;
use Inertia\Response;

/**
 *
 */
class PagesController extends Controller
{

    /**
     * @param  Request  $request
     *
     * @return Response
     */
    public function privacy(Request $request): Response
    {
        $data = [
            'title'       => Functions::__('Privacy Policy'),
            'description' => 'We care about your privacy, this page will describe how we manage, use, and secure your data.',
        ];

        View::share($data);

        return Inertia::render('Privacy', $data);
    }

    /**
     * @param  Request  $request
     *
     * @return \Inertia\Response
     */
    public function terms(Request $request)
    {
        $data = [
            'title'       => Functions::__('Terms & Conditions'),
            'description' => 'Terms and Conditions apply when using our services, please read these carefully.',
        ];
        View::share($data);

        return Inertia::render('Terms', $data);
    }

    /**
     * @param  Request  $request
     *
     * @return \Inertia\Response
     */
    public function cookies(Request $request): Response
    {
        $data = [
            'title'       => Functions::__('Cookies'),
            'description' => 'Cookies are file stored inside your browser to help you get a better experience.',
        ];

        View::share($data);

        return Inertia::render('Cookies', $data);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @return null
     */
    public function thankyou(Request $request)
    {
        $data = [
            'title'       => Functions::__('Thank you'),
            'description' => 'Thank you, to all of these packages and their authors who made Mecarshop.com and millions of other websites available.',
            'packages'    => \Composer\InstalledVersions::getInstalledPackages(),
        ];

        View::share($data);

        return Inertia::render('ThankYou', $data);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Inertia\Response
     */
    public function pricing(Request $request): Response
    {
        $data = [
            'title'       => Functions::__('Pricing'),
            'description' => 'Find more details about Mecarshop.com pricing plans.',
            'plans'       => config('plans'),
        ];

        View::share($data);

        return Inertia::render('Pricing', $data);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Inertia\Response
     */
    public function updates(Request $request)
    {
        $data = [
            'title'       => Functions::__('Updates'),
            'description' => 'A brief list of Mecarshop.com ongoing updates.',
        ];
        View::share($data);

        return Inertia::render('Updates', $data);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     *
     * @return \Inertia\Response
     */
    public function support(Request $request)
    {
        $data = [
            'title'       => Functions::__('Support'),
            'description' => 'Are you looking for support, this page will guide you through the steps to get the help you need',
        ];
        View::share($data);

        return Inertia::render('Support', $data);
    }

}
