<?php

namespace App\Console\Commands\Admin\Shop;

use App\Models\Shop;
use Illuminate\Console\Command;

class Manage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mcs:shop:list {--active=true}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $Shops = new Shop();

        if ($this->hasOption('active')) {

            if (!in_array($this->option('active'), ['true', 'false'])) {
                return $this->error('--active param can only be `true` or `false`');
            }

            $this->info('Getting List of inactive');
            $Shops->active(false);
        }


        $this->info($Shops->pluck('id'));
    }
}
