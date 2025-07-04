<?php

namespace App\Console\Commands\Admin\Shop;

use App\Models\Shop;
use Illuminate\Console\Command;

class Disapprove extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mcs:shop:disapprove {shop_id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Disapprove shop';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        /** @var Shop $Shop */
        $Shop = Shop::where(['id' => $this->argument('shop_id')])->first();

        if (!$Shop) {
            $this->warn('Shop not found');
        }

        if (!$Shop->is_approved) {
            $this->warn('Shop is already disapproved');

            return;
        }

        if ($Shop->disapprove()) {
            $this->info('Shop Disapproved');
        }
    }
}
