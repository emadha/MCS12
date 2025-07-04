<?php

namespace App\Console\Commands\ListingItem;

use App\Models\ListingItem;
use Illuminate\Console\Command;

class Main extends Command {

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mcs:listing-items:list {--status=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle() {
        $allowed_status = ['not_active'];
        if ($this->option('status')) {
            if (in_array($this->option('status'), $allowed_status)) {
                switch ($this->option('status')) {
                    case 'not_active':
                    {
                        $this->info(
                            "Listing items which are not active are: " .
                            ListingItem::select('id')
                                ->notApproved()
                                ->get()
                                ->pluck('id')
                        );
                        break;
                    }
                }
            }
            else {
                $this->warn('Invalid status input, allowed are: ' . implode(',',
                        $allowed_status));
            }
        }
    }

}
