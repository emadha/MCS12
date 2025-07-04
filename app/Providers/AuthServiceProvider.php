<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\Models\Listing;
use App\Models\ListingItem;
use App\Models\Message;
use App\Models\MessageBoard;
use App\Models\Photo;
use App\Models\Shop;
use App\Models\User;
use App\Policies\ListingItemPolicy;
use App\Policies\ListingPolicy;
use App\Policies\MessageBoarsPolicy;
use App\Policies\MessagePolicy;
use App\Policies\PhotoPolicy;
use App\Policies\ShopPolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        MessageBoard::class => MessageBoarsPolicy::class,
        Message::class      => MessagePolicy::class,
        ListingItem::class  => ListingItemPolicy::class,
        Photo::class        => PhotoPolicy::class,
        Shop::class         => ShopPolicy::class,
        User::class         => UserPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        Gate::before(function ($user, $ability) {
            return $user->hasRole('Super Admin') ? true : null;
        });
    }

}
