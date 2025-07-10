<?php

namespace App\Providers;

use App\Events\Listing\ItemCreatedEvent;
use App\Events\Listing\ListingDeletedEvent;
use App\Events\MessageSent;
use App\Events\Reports\ItemReportedEvent;
use App\Events\Shop\ShopCreatedEvent;
use App\Listeners\Listing\ItemCreatedListener;
use App\Listeners\Listing\ListingDeletedListener;
use App\Listeners\LogSuccessfulLogin;
use App\Listeners\MessageSentListener;
use App\Listeners\Reports\ItemReportedListener;
use App\Listeners\Shop\ShopCreatedListener;
use App\Models\Activity;
use App\Models\Credit;
use App\Models\Favorite;
use App\Models\Interaction;
use App\Models\ListingItem;
use App\Models\ListingItemsCar;
use App\Models\Message;
use App\Models\MessageBoard;
use App\Models\Photo;
use App\Models\Settings;
use App\Models\Shop;
use App\Models\User;
use App\Models\UserPhoto;
use App\Observers\ActivityObserver;
use App\Observers\CreditObserver;
use App\Observers\FavoriteObserver;
use App\Observers\InteractionObserver;
use App\Observers\ListingItemObserver;
use App\Observers\ListingItemsCarObserver;
use App\Observers\MessageBoardObserver;
use App\Observers\MessageObserver;
use App\Observers\PhotoObserver;
use App\Observers\SettingObserver;
use App\Observers\ShopObserver;
use App\Observers\UserObserver;
use App\Observers\UserPhotoObserver;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use SocialiteProviders\Manager\SocialiteWasCalled;
use SocialiteProviders\Microsoft\MicrosoftExtendSocialite;

class EventServiceProvider extends ServiceProvider
{

    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        ItemReportedEvent::class   => [ItemReportedListener::class],
        ItemCreatedEvent::class    => [ItemCreatedListener::class],
        MessageSent::class         => [MessageSentListener::class],
        ListingDeletedEvent::class => [ListingDeletedListener::class],
        Registered::class          => [SendEmailVerificationNotification::class],
        ShopCreatedEvent::class    => [ShopCreatedListener::class],
        SocialiteWasCalled::class  => [MicrosoftExtendSocialite::class.'@handle'],
        Login::class               => [LogSuccessfulLogin::class],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {

    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }

}
