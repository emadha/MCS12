<?php

namespace App\Console\Commands\Admin\Shop;

use App\Models\ShopType;
use Illuminate\Console\Command;

/**
 *
 */
class CreateShopType extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mcs:shop:create-type {type}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new Shop Type';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $shopType = null;
        switch ($this->argument('type')) {
            case 'showroom':
                $shopType = ShopType::TYPE_SHOWROOM;
                break;
        }

        if ($shopType === null) {
            return $this->error('ShopType {type} ['.$this->argument('type').'] is not defined.');
        }

        if ($exists = ShopType::where('type', $shopType)->first()) {
            $this->warn('Shop type already exists ['.$exists->id.']');

            return false;
        } else {
            $storedShopType = ShopType::updateOrCreate(['type' => $shopType], ['type' => $shopType]);

            if ($storedShopType) {
                $this->info('Shoptype '.array_search($this->argument('type'), ShopType::$shopTypes).' was created');

                return true;
            }
        }
    }
}
