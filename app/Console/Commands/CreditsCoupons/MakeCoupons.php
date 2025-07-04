<?php

namespace App\Console\Commands\CreditsCoupons;

use App\Models\CreditsCoupons;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class MakeCoupons extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mcs:make-coupons {--num=1} {--amount=100} {--note=T#2}';

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
        if ($this->option('num')) {
        }

        for ($i = 0; $i <= $this->option('num'); $i++) {
            CreditsCoupons::create([
                'amount' => $this->option('amount'),
                'code'   => strtoupper(Str::random(14)),
                'note'   => $this->option('note'),
            ]);
        }
    }
}
