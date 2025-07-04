<?php

namespace App\Console\Commands;

use App\Models\ListingItem;
use Illuminate\Console\Command;

class ListingsPurge extends Command
{

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'listings:purge';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Force delete Listing items';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        ListingItem::withTrashed()->get()->each(function (ListingItem $listingItem) {
            if ($listingItem?->forceDelete()) {
                $this->info('Listing item #'.$listingItem->id.' deleted.');
            }
        });

        return;
    }

}
