<?php

namespace App\Console\Commands\ListingItem;

use App\Models\ListingItem;
use Illuminate\Console\Command;

class DeletePhotos extends Command
{

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mcs:listing-item:delete-photos {itemID}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete photos of a listing item';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $listingItem = ListingItem::find($this->argument('itemID'));
        $this->info('Deleted '.$listingItem->photos()->delete().' photo(s).');
    }

}
