<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Http\Controllers\BalanceController;
use App\Models\Contact;
use App\Models\ListingItem;
use App\Models\ListingItemsCar;
use App\Models\Photo;
use App\Models\Shop;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run(): void
    {
        $this->call([
            // RolesAndPermissionSeeder::class, already calling in migration
            BadgeSeeder::class,
        ]);

        // Create Super Admin
        dump('Creating User');
        $AdminUser = User::create([
            'first_name'        => 'Emad',
            'last_name'         => 'H.',
            'email'             => 'emad.haa@gmail.com',
            'email_verified_at' => now(),
            'password'          => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token'    => Str::random(10),
            'created_at'        => Carbon::now(),
        ])->assignRole(Role::where('name', 'Super Admin')->first());

        dump('Generating coupons');
        Artisan::call('mcs:make-coupons --num=100');

        $creditsCount = 10000;
        dump('Giving '.$creditsCount.' to user '.$AdminUser->email);

        dump('Giving admin privileges to user id 1');
        Artisan::call('mcs:admin:make 1');

        BalanceController::giveCreditsToUser($AdminUser, $creditsCount, 'Database seeder');
        self::dummyData();
    }

    public function dummyData()
    {
        $picsumPhotosDummyIDs = Storage::drive('listings')->files('picsum');
        preg_match_all('/picsum\/(.*?).png/', implode(',', $picsumPhotosDummyIDs), $matches);
        $ids = $matches[1];

        dump('Creating Users');
        # Create {x} Users with {x} shops
        User::factory(2000)->create();

        dump('Creating Shops');
        Shop::factory(200)->create();

        dump("Running ListingItemFactory");
        $listingItemFactory = ListingItem
            ::factory(rand(400, 1231))
            ->has(
                Photo::factory(rand(8, 12))->afterCreating(function (Photo $i) use ($ids) {
                    $i->StoreImageFromRemote($ids);
                })
            )
            ->has(Contact::factory(rand(1,4)))
            ->create();

        $listingItemFactory->each(function (ListingItem $listingItem) {
            dump("Adding Listing Item Car to Listing Item:".$listingItem->id);
            $listItemCar = ListingItemsCar::factory()->create();
            $listingItem->item_type = ListingItemsCar::class;
            $listingItem->item_id = $listItemCar->id;
            $listingItem->save();

            /** @var Photo $primaryPhoto */
            $primaryPhoto = $listingItem->photos()->inRandomOrder()->first();
            if ($primaryPhoto) {
                $listingItem->setPhotoToPrimary($primaryPhoto);
            }

            /** @var Photo $coverPhoto */
            $coverPhoto = $listingItem->photos()->inRandomOrder()->first();
            if ($coverPhoto) {
                $listingItem->setPhotoToCover($coverPhoto);
            }
        });

        dump('Creating random promotions');
        ListingItem::limit(7)->inRandomOrder()->get()->each(function ($listingItem) {
            $listingItem->promotions()->create([
                'user_id'    => 1,
                'item_type'  => get_class($listingItem),
                'item_id'    => $listingItem->id,
                'expires_at' => Carbon::now()->addDays(30),
                'is_active'  => 1,
            ]);
        });
    }

}
