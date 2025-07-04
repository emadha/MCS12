<?php

namespace App\Console\Commands\Admin\ListingItem;

use App\Models\ListingItem;
use App\Models\Shop;
use Illuminate\Console\Command;

class Disapprove extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mcs:listing-items:disapprove {listing_item_id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Disapprove Listing item';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        /** @var ListingItem $listingItem */
        $listingItem = ListingItem::where([
            'id' => $this->argument('listing_item_id'),
        ])->first();

        if (!$listingItem) {
            $this->error('Listing item not found.');

            return;
        }

        if (!$listingItem->is_approved) {
            $this->error('Listing item is already disapproved.');

            return;
        }

        if ($listingItem->disapprove()) {
            $this->warn('Listing item disapproved.');
        }
    }
}
