<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Mailer\Exception\TransportException;

class EmailVerificationNotificationController extends Controller
{

    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(RouteServiceProvider::HOME);
        }
        
        try {
            $request->user()->sendEmailVerificationNotification();
            $status = 'verification-link-sent';
        } catch (\Exception|TransportException $exception) {
            $status = 'fatal-error';
            Log::error('E-Mail Verification: '.$exception->getMessage());
        }

        return back()->with('status', $status);
    }

}
